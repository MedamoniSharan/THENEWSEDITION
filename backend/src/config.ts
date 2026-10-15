import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const env = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    ADMIN_EMAIL: z.email().optional(),
    ADMIN_PASSWORD: z.string().min(8).optional(),
    CORS_ORIGIN: z.string().optional(),
    FRONTEND_DIST: z.string().optional(),
  })
  .parse(process.env)

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const config = {
  ...env,
  isProduction: env.NODE_ENV === 'production',
  frontendDist: env.FRONTEND_DIST ?? path.resolve(backendRoot, '../frontend/dist'),
  corsOrigins: env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean) ?? [],
}
