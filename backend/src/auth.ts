import { createHash, timingSafeEqual } from 'node:crypto'
import { Router, type CookieOptions, type RequestHandler, type Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import { config } from './config.ts'
import { HttpError } from './lib/http.ts'
import { Admin } from './models.ts'
import { loginInput, passwordInput } from './schemas.ts'

const COOKIE = 'tne_admin'
const SESSION_DAYS = 7

const digest = (value: string) => createHash('sha256').update(value).digest()

// Constant-time comparison so response timing doesn't reveal how much of a guess was right.
const samePassword = (given: string, stored: string | null | undefined) =>
  stored != null && timingSafeEqual(digest(given), digest(stored))

const cookieOptions: CookieOptions = {
  httpOnly: true,
  // Strict keeps other sites from sending admin requests with this cookie.
  sameSite: config.corsOrigins.length ? 'none' : 'strict',
  secure: config.isProduction || config.corsOrigins.length > 0,
  path: '/api',
}

declare module 'express-serve-static-core' {
  interface Request {
    adminId?: string
  }
}

async function sessionAdmin(token: string | undefined) {
  if (!token) return null
  try {
    const { sub, v = 0 } = jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] }) as { sub: string; v?: number }
    const admin = await Admin.findById(sub).lean()
    return admin && (admin.sessionVersion ?? 0) === v ? admin : null
  } catch {
    return null
  }
}

function startSession(res: Response, admin: { _id: unknown; sessionVersion?: number | null }) {
  const token = jwt.sign({ sub: String(admin._id), v: admin.sessionVersion ?? 0 }, config.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${SESSION_DAYS}d`,
  })
  res.cookie(COOKIE, token, { ...cookieOptions, maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000 })
}

const passwordAttempts = () =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many attempts, try again in 15 minutes' },
  })

export const requireAdmin: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.[COOKIE]
  if (!token) throw new HttpError(401, 'Please sign in')
  const admin = await sessionAdmin(token)
  if (!admin) throw new HttpError(401, 'Your session has expired, please sign in again')
  req.adminId = String(admin._id)
  next()
}

export async function ensureFirstAdmin() {
  if (await Admin.exists({})) return
  if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) {
    console.warn('No admin account yet: set ADMIN_EMAIL and ADMIN_PASSWORD to create one.')
    return
  }
  await Admin.create({ email: config.ADMIN_EMAIL, password: config.ADMIN_PASSWORD })
  console.log(`Created admin account ${config.ADMIN_EMAIL}`)
}

export const authRouter = Router()

authRouter.post('/login', passwordAttempts(), async (req, res) => {
  const { email, password } = loginInput.parse(req.body)
  const admin = await Admin.findOne({ email: email.toLowerCase() })
  if (!admin || !samePassword(password, admin.password)) {
    throw new HttpError(401, 'Wrong email or password')
  }
  startSession(res, admin)
  res.json({ email: admin.email })
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE, cookieOptions)
  res.status(204).end()
})

authRouter.get('/me', async (req, res) => {
  const admin = await sessionAdmin(req.cookies?.[COOKIE])
  res.setHeader('Cache-Control', 'no-store')
  res.json(admin ? { email: admin.email } : null)
})

authRouter.get('/password', requireAdmin, async (req, res) => {
  const admin = await Admin.findById(req.adminId).select('password').lean()
  res.setHeader('Cache-Control', 'no-store')
  res.json({ password: admin?.password ?? '' })
})

authRouter.post('/password', requireAdmin, passwordAttempts(), async (req, res) => {
  const { current, next } = passwordInput.parse(req.body)
  const admin = await Admin.findById(req.adminId)
  if (!admin || !samePassword(current, admin.password)) {
    throw new HttpError(400, 'Current password is wrong')
  }
  if (current === next) throw new HttpError(400, 'The new password must be different from the current one')
  admin.password = next
  admin.sessionVersion = (admin.sessionVersion ?? 0) + 1
  await admin.save()
  startSession(res, admin)
  res.status(204).end()
})
