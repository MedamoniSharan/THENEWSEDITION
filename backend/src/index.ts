import mongoose from 'mongoose'
import { createApp } from './app.ts'
import { ensureFirstAdmin } from './auth.ts'
import { config } from './config.ts'
import { connectDb } from './db.ts'
import { seedIfEmpty } from './seed/seed.ts'

await connectDb()
await ensureFirstAdmin()
await seedIfEmpty()

const server = createApp().listen(config.PORT, () => {
  console.log(`API listening on http://localhost:${config.PORT}`)
})

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close(() => void mongoose.disconnect().then(() => process.exit(0)))
  })
}
