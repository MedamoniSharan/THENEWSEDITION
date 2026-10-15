import mongoose from 'mongoose'
import { connectDb } from '../db.ts'
import { Settings } from '../models.ts'
import { seed } from './seed.ts'

const reset = process.argv.includes('--reset')

await connectDb()
if (!reset && (await Settings.exists({ key: 'site' }))) {
  console.log('The database already has content. Run "npm run seed -- --reset" to replace it with the launch content.')
} else {
  await seed({ reset })
  console.log(reset ? 'Replaced all content with the launch content' : 'Added the launch content')
}
await mongoose.disconnect()
