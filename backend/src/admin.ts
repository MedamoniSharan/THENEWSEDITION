import { Router } from 'express'
import type mongoose from 'mongoose'
import multer from 'multer'
import type { ZodType } from 'zod'
import { requireAdmin } from './auth.ts'
import { getSettings } from './content.ts'
import { HttpError, notFound, objectId } from './lib/http.ts'
import { deleteAsset, IMAGE_TYPES, serializeAsset, storeUpload, VIDEO_TYPES } from './lib/media.ts'
import { invalidateResponses } from './lib/responseCache.ts'
import { lookupYouTube } from './lib/youtube.ts'
import { Article, Asset, Category, Quote, Reel, Settings, type AssetDoc } from './models.ts'
import { articleInput, categoryInput, orderInput, quoteInput, reelInput, settingsInput } from './schemas.ts'

const MAX_UPLOAD_MB = 100

type AnyModel = mongoose.Model<any>
type Doc = Record<string, unknown> & { _id: unknown }

const withId = ({ _id, __v: _v, ...rest }: Doc) => ({ id: String(_id), ...rest })

async function requireCategory(slug: string) {
  if (!(await Category.exists({ slug }))) throw new HttpError(400, `Category "${slug}" does not exist`)
}

interface CollectionOptions<T> {
  sort: Record<string, 1 | -1>
  ordered?: boolean
  validate?: (data: T) => Promise<void>
  beforeUpdate?: (existing: Doc, data: T) => Promise<void>
  beforeDelete?: (existing: Doc) => Promise<void>
  afterDelete?: (existing: Doc) => Promise<void>
}

function collection<T extends object>(model: AnyModel, input: ZodType<T>, options: CollectionOptions<T>) {
  const router = Router()

  router.get('/', async (_req, res) => {
    res.json(((await model.find().sort(options.sort).lean()) as Doc[]).map(withId))
  })

  router.post('/', async (req, res) => {
    const data = input.parse(req.body)
    await options.validate?.(data)
    const extra: { order?: number } = {}
    if (options.ordered) {
      const last = (await model.findOne().sort({ order: -1 }).select('order').lean()) as { order?: number } | null
      extra.order = (last?.order ?? -1) + 1
    }
    const doc = await model.create({ ...data, ...extra })
    res.status(201).json(withId(doc.toObject()))
  })

  router.put('/order', async (req, res) => {
    const { ids } = orderInput.parse(req.body)
    await model.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: objectId(id) }, update: { $set: { order } } } })))
    res.status(204).end()
  })

  router.put('/:id', async (req, res) => {
    const data = input.parse(req.body)
    await options.validate?.(data)
    const existing = (await model.findById(objectId(req.params.id)).lean()) as Doc | null
    if (!existing) throw notFound('This item was deleted')
    await options.beforeUpdate?.(existing, data)
    const doc = (await model.findByIdAndUpdate(existing._id, data, { new: true, runValidators: true }).lean()) as Doc
    res.json(withId(doc))
  })

  router.delete('/:id', async (req, res) => {
    const existing = (await model.findById(objectId(req.params.id)).lean()) as Doc | null
    if (!existing) throw notFound('This item was already deleted')
    await options.beforeDelete?.(existing)
    await model.deleteOne({ _id: existing._id })
    await options.afterDelete?.(existing)
    res.status(204).end()
  })

  return router
}

export const adminRouter = Router()

adminRouter.use(requireAdmin)
adminRouter.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    // Cleared both before and after the write so no visitor request can cache the old content in between.
    invalidateResponses()
    res.on('finish', () => res.statusCode < 400 && invalidateResponses())
  }
  next()
})

adminRouter.use(
  '/categories',
  collection(Category, categoryInput, {
    sort: { order: 1, createdAt: 1 },
    ordered: true,
    async beforeUpdate(existing, data) {
      if (existing.slug === data.slug) return
      await Article.updateMany({ category: existing.slug }, { category: data.slug })
      await Reel.updateMany({ category: existing.slug }, { category: data.slug })
    },
    async beforeDelete(existing) {
      const [articles, reels] = await Promise.all([
        Article.countDocuments({ category: existing.slug }),
        Reel.countDocuments({ category: existing.slug }),
      ])
      if (articles || reels) {
        throw new HttpError(409, `Move or delete the ${articles} article(s) and ${reels} reel(s) in this category first`)
      }
    },
  }),
)

adminRouter.use(
  '/articles',
  collection(Article, articleInput, {
    sort: { date: -1, createdAt: -1 },
    validate: (data) => requireCategory(data.category),
    async afterDelete(existing) {
      const id = existing._id
      await Settings.updateOne(
        { key: 'site' },
        { $pull: { 'homepage.side': id, 'homepage.latest': id, 'homepage.popular': id, 'homepage.highlight': id } },
      )
      for (const field of ['hero', 'popularFeature', 'highlightFeature']) {
        await Settings.updateOne({ key: 'site', [`homepage.${field}`]: id }, { $set: { [`homepage.${field}`]: null } })
      }
    },
  }),
)

adminRouter.use(
  '/reels',
  collection(Reel, reelInput, { sort: { order: 1, createdAt: 1 }, ordered: true, validate: (data) => requireCategory(data.category) }),
)

adminRouter.use('/quotes', collection(Quote, quoteInput, { sort: { order: 1, createdAt: 1 }, ordered: true }))

function serializeSettings(s: Awaited<ReturnType<typeof getSettings>>) {
  const map = (v: unknown) => (v instanceof Map ? Object.fromEntries(v) : (v ?? {}))
  const hp = s.homepage
  const ids = (list: unknown[] = []) => list.map(String)
  return {
    tagline: s.tagline,
    ticker: s.ticker,
    homepage: {
      hero: hp?.hero ? String(hp.hero) : null,
      side: ids(hp?.side),
      latest: ids(hp?.latest),
      popularFeature: hp?.popularFeature ? String(hp.popularFeature) : null,
      popular: ids(hp?.popular),
      highlightFeature: hp?.highlightFeature ? String(hp.highlightFeature) : null,
      highlight: ids(hp?.highlight),
    },
    videos: s.videos,
    instagram: s.instagram,
    socials: s.socials,
    contact: s.contact,
    intro: s.intro,
    subscribeUrl: s.subscribeUrl,
    uiText: { en: map(s.uiText?.en), te: map(s.uiText?.te) },
  }
}

adminRouter.get('/settings', async (_req, res) => {
  res.json(serializeSettings(await getSettings()))
})

adminRouter.put('/settings', async (req, res) => {
  const changes = settingsInput.parse(req.body)
  await getSettings()
  const updated = await Settings.findOneAndUpdate({ key: 'site' }, { $set: changes }, { new: true, runValidators: true }).lean()
  res.json(serializeSettings(updated!))
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, [...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.mimetype)),
})

adminRouter.post('/media', upload.single('file'), async (req, res) => {
  if (!req.file) throw new HttpError(415, 'Upload a JPG, PNG, WebP, AVIF or GIF image, or an MP4, WebM or MOV video')
  res.status(201).json(await storeUpload(req.file))
})

adminRouter.get('/media', async (req, res) => {
  const filter = req.query.kind === 'image' || req.query.kind === 'video' ? { kind: req.query.kind } : {}
  const assets = (await Asset.find(filter).sort({ createdAt: -1 }).limit(1000).lean()) as AssetDoc[]
  res.json(assets.map(serializeAsset))
})

adminRouter.delete('/media/:id', async (req, res) => {
  await deleteAsset(req.params.id)
  res.status(204).end()
})

adminRouter.get('/youtube', async (req, res) => {
  res.json(await lookupYouTube(String(req.query.url ?? '')))
})

adminRouter.get('/stats', async (_req, res) => {
  const [articles, published, missingTelugu, categories, reels, quotes, media, perCategory] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ published: true }),
    Article.countDocuments({ $or: [{ 'title.te': '' }, { 'excerpt.te': '' }] }),
    Category.countDocuments(),
    Reel.countDocuments(),
    Quote.countDocuments(),
    Asset.countDocuments(),
    Article.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ])
  res.json({
    articles,
    published,
    missingTelugu,
    categories,
    reels,
    quotes,
    media,
    perCategory: Object.fromEntries(perCategory.map((c) => [c._id, c.count])),
  })
})
