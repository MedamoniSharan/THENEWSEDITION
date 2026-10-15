import compression from 'compression'
import cookieParser from 'cookie-parser'
import express, { type RequestHandler } from 'express'
import helmet from 'helmet'
import { adminRouter } from './admin.ts'
import { authRouter } from './auth.ts'
import { config } from './config.ts'
import { contentRouter } from './content.ts'
import { errorHandler, notFound } from './lib/http.ts'
import { serveMedia } from './lib/media.ts'
import { frontend, inlineScriptHashes } from './lib/static.ts'

const cors: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin
  if (origin && config.corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.append('Vary', 'Origin')
    if (req.method === 'OPTIONS') return res.status(204).end()
  }
  next()
}

export function createApp() {
  const app = express()
  const site = config.isProduction ? frontend(config.frontendDist) : null
  if (config.isProduction) app.set('trust proxy', 1)

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      // YouTube refuses to play embeds that arrive without a referrer.
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      contentSecurityPolicy: {
        directives: {
          upgradeInsecureRequests: null,
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", ...(site ? inlineScriptHashes(site.indexHtml) : [])],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          mediaSrc: ["'self'", 'blob:', 'https:'],
          frameSrc: ['https://www.youtube.com', 'https://www.youtube-nocookie.com'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
    }),
  )
  app.use(compression())
  app.use(cors)
  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api', contentRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api', () => {
    throw notFound()
  })
  app.get('/media/:id', serveMedia)

  if (site) app.use(site.handler)

  app.use(errorHandler)
  return app
}
