import type { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import { MulterError } from 'multer'
import { ZodError } from 'zod'

export class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const notFound = (what = 'Not found') => new HttpError(404, what)

export function objectId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw notFound()
  return new mongoose.Types.ObjectId(id)
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const issue = err.issues[0]
    const field = issue?.path.join('.')
    return res.status(400).json({ error: field ? `${field}: ${issue.message}` : issue?.message, issues: err.issues })
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message
    return res.status(413).json({ error: message })
  }
  if ((err as { code?: number }).code === 11000) return res.status(409).json({ error: 'That already exists' })
  if ((err as { type?: string }).type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large' })

  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
}
