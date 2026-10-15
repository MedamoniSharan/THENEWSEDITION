import { createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { brotliCompress, constants, gzip } from 'node:zlib'
import type { Request, Response } from 'express'

const brotli = promisify(brotliCompress)
const gz = promisify(gzip)

/** Rebuild even without writes, in case the database was changed outside this server. */
const MAX_AGE_MS = 10 * 60 * 1000

interface Encoded {
  etag: string
  raw: Buffer
  br: Buffer
  gzip: Buffer
  builtAt: number
}

const store = new Map<string, Promise<Encoded>>()

async function encode(data: unknown): Promise<Encoded> {
  const raw = Buffer.from(JSON.stringify(data))
  const [br, gzip] = await Promise.all([
    brotli(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }),
    gz(raw, { level: 9 }),
  ])
  const etag = `"${createHash('sha1').update(raw).digest('base64url')}"`
  return { etag, raw, br, gzip, builtAt: Date.now() }
}

/** Drops every cached public response; called after any admin change. */
export function invalidateResponses() {
  store.clear()
}

/**
 * Serves JSON built once and kept pre-compressed in memory. Browsers always revalidate with the
 * ETag, so visitors see admin changes on their next load while unchanged content costs a 304.
 */
export async function sendCachedJson(req: Request, res: Response, key: string, build: () => Promise<unknown>) {
  let entry = store.get(key)
  if (entry) {
    const done = await entry.catch(() => undefined)
    if (!done || Date.now() - done.builtAt > MAX_AGE_MS) entry = undefined
  }
  if (!entry) {
    const pending = build().then(encode)
    store.set(key, pending)
    pending.catch(() => store.get(key) === pending && store.delete(key))
    entry = pending
  }

  const body = await entry
  res.setHeader('ETag', body.etag)
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  res.setHeader('Vary', 'Accept-Encoding')
  res.type('application/json')

  if (req.headers['if-none-match'] === body.etag) return res.status(304).end()

  const accepts = String(req.headers['accept-encoding'] ?? '')
  if (/\bbr\b/.test(accepts)) {
    res.setHeader('Content-Encoding', 'br')
    return res.send(body.br)
  }
  if (/\bgzip\b/.test(accepts)) {
    res.setHeader('Content-Encoding', 'gzip')
    return res.send(body.gzip)
  }
  res.send(body.raw)
}
