import mongoose from 'mongoose'
import { config } from './config.ts'

export async function connectDb() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(config.MONGODB_URI, { maxPoolSize: 20, serverSelectionTimeoutMS: 15000 })
  console.log(`Connected to MongoDB database "${mongoose.connection.name}"`)
}
