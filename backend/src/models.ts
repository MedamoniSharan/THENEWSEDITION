import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const localized = new Schema({ en: { type: String, default: '' }, te: { type: String, default: '' } }, { _id: false })

const categorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: localized, required: true },
    description: { type: localized, default: () => ({}) },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const articleSchema = new Schema(
  {
    title: { type: localized, required: true },
    excerpt: { type: localized, default: () => ({}) },
    image: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    author: { name: { type: localized, default: () => ({}) } },
    /** ISO day, e.g. 2026-10-11. */
    date: { type: String, required: true, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
)
articleSchema.index({ category: 1, published: 1, date: -1 })

const reelSchema = new Schema(
  {
    category: { type: String, required: true },
    caption: { type: localized, default: () => ({}) },
    video: { type: String, required: true },
    poster: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const quoteSchema = new Schema(
  {
    name: { type: localized, required: true },
    role: { type: localized, default: () => ({}) },
    paragraphs: { type: [localized], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const articleRef = { type: Schema.Types.ObjectId, ref: 'Article' }

const settingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site' },
    tagline: { type: localized, default: () => ({}) },
    ticker: { type: [localized], default: [] },
    homepage: {
      hero: { ...articleRef, default: null },
      side: { type: [articleRef], default: [] },
      latest: { type: [articleRef], default: [] },
      popularFeature: { ...articleRef, default: null },
      popular: { type: [articleRef], default: [] },
      highlightFeature: { ...articleRef, default: null },
      highlight: { type: [articleRef], default: [] },
    },
    videos: {
      type: [
        new Schema(
          { youtubeId: { type: String, required: true }, title: { type: localized, default: () => ({}) }, channel: String },
          { _id: false },
        ),
      ],
      default: [],
    },
    instagram: { handle: { type: String, default: '' }, url: { type: String, default: '' } },
    socials: {
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      x: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      directionsUrl: { type: String, default: '' },
    },
    intro: { enabled: { type: Boolean, default: true }, video: { type: String, default: '' } },
    subscribeUrl: { type: String, default: '' },
    /** Overrides for the built-in interface text, keyed by language then string key. */
    uiText: {
      en: { type: Map, of: String, default: () => new Map() },
      te: { type: Map, of: String, default: () => new Map() },
    },
  },
  { timestamps: true },
)

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // Bumped on password change so sessions issued earlier stop working.
    sessionVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const assetSchema = new Schema(
  {
    kind: { type: String, enum: ['image', 'video'], required: true },
    filename: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    width: Number,
    height: Number,
    /** Image renditions stored in GridFS, smallest first. Videos have a single entry with width 0. */
    files: {
      type: [new Schema({ width: Number, fileId: Schema.Types.ObjectId, size: Number, mime: String }, { _id: false })],
      default: [],
    },
  },
  { timestamps: true },
)

export const Category = mongoose.model('Category', categorySchema)
export const Article = mongoose.model('Article', articleSchema)
export const Reel = mongoose.model('Reel', reelSchema)
export const Quote = mongoose.model('Quote', quoteSchema)
export const Settings = mongoose.model('Settings', settingsSchema)
export const Admin = mongoose.model('Admin', adminSchema)
export const Asset = mongoose.model('Asset', assetSchema)

export type ArticleDoc = InferSchemaType<typeof articleSchema> & { _id: mongoose.Types.ObjectId }
export type SettingsDoc = InferSchemaType<typeof settingsSchema>
export type AssetDoc = InferSchemaType<typeof assetSchema> & { _id: mongoose.Types.ObjectId }
