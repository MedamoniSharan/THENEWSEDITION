import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import express, { type RequestHandler } from 'express'

const COMPRESSIBLE: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

interface Precompressed {
  type: string
  etag: string
  raw: Buffer
  br: Buffer
  gzip: Buffer
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

/** Inline scripts in the built index.html, as CSP hashes so they can run without allowing all inline code. */
export function inlineScriptHashes(html: string) {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
  )
}

/**
 * Serves the built frontend. Text files are brotli/gzip-compressed once at startup; hashed files in
 * /assets are cached for a year, index.html is always revalidated so new deploys show up immediately.
 */
export function frontend(dist: string): { handler: RequestHandler; indexHtml: string } | null {
  const indexPath = path.join(dist, 'index.html')
  if (!existsSync(indexPath)) return null

  const files = new Map<string, Precompressed>()
  for (const file of walk(dist)) {
    const type = COMPRESSIBLE[path.extname(file)]
    if (!type) continue
    const raw = readFileSync(file)
    files.set('/' + path.relative(dist, file).split(path.sep).join('/'), {
      type,
      raw,
      etag: `"${createHash('sha1').update(raw).digest('base64url')}"`,
      br: brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }),
      gzip: gzipSync(raw, { level: 9 }),
    })
  }

  const cacheControl = (urlPath: string) =>
    urlPath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : urlPath === '/index.html'
        ? 'no-cache'
        : 'public, max-age=86400'

  const sendFile: RequestHandler = (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const isPage = !path.extname(req.path) && !req.path.startsWith('/api/') && !req.path.startsWith('/media/')
    const key = isPage ? '/index.html' : req.path
    const file = files.get(key)
    if (!file) return next()

    res.setHeader('Content-Type', file.type)
    res.setHeader('Cache-Control', cacheControl(key))
    res.setHeader('ETag', file.etag)
    res.setHeader('Vary', 'Accept-Encoding')
    if (req.headers['if-none-match'] === file.etag) return res.status(304).end()

    const accepts = String(req.headers['accept-encoding'] ?? '')
    const [body, encoding] = /\bbr\b/.test(accepts)
      ? [file.br, 'br']
      : /\bgzip\b/.test(accepts)
        ? [file.gzip, 'gzip']
        : [file.raw, undefined]
    if (encoding) res.setHeader('Content-Encoding', encoding)
    res.setHeader('Content-Length', String(body.length))
    res.end(req.method === 'HEAD' ? undefined : body)
  }

  // Images, videos and fonts from /public; express.static handles range requests for the reels.
  const binary = express.static(dist, {
    index: false,
    setHeaders: (res, filePath) => {
      const rel = '/' + path.relative(dist, filePath).split(path.sep).join('/')
      res.setHeader('Cache-Control', cacheControl(rel))
    },
  })

  const handler: RequestHandler = (req, res, next) => sendFile(req, res, () => binary(req, res, next))
  return { handler, indexHtml: readFileSync(indexPath, 'utf8') }
}
