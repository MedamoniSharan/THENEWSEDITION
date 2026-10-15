import { randomBytes } from 'node:crypto'
import mongoose from 'mongoose'
import { connectDb } from './db.ts'
import { Admin } from './models.ts'

const email = process.argv[2]?.toLowerCase()

await connectDb()
const admins = await Admin.find(email ? { email } : {})
if (admins.length !== 1) {
  const all = await Admin.find().select('email').lean()
  console.error(
    email
      ? `No admin with email ${email}. Admins: ${all.map((a) => a.email).join(', ') || 'none'}`
      : `Say which admin to reset: npm run reset-password -- <email>. Admins: ${all.map((a) => a.email).join(', ') || 'none'}`,
  )
  process.exitCode = 1
} else {
  const [admin] = admins
  const password = randomBytes(9).toString('base64url')
  admin.password = password
  admin.sessionVersion = (admin.sessionVersion ?? 0) + 1
  await admin.save()
  console.log(`New password for ${admin.email}: ${password}`)
  console.log('All existing sessions are signed out. Change it on the Account page after signing in.')
}
await mongoose.disconnect()
