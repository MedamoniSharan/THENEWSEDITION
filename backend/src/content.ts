import { Router } from 'express'
import type mongoose from 'mongoose'
import { notFound } from './lib/http.ts'
import { sendCachedJson } from './lib/responseCache.ts'
import { Article, Category, Quote, Reel, Settings, type ArticleDoc } from './models.ts'
import { slug as slugSchema } from './schemas.ts'

export const CATEGORY_PAGE_SIZE = 24

export async function getSettings() {
  const existing = await Settings.findOne({ key: 'site' }).lean()
  if (existing) return existing
  return (await Settings.create({ key: 'site' })).toObject()
}

const plainMap = (value: unknown) =>
  value instanceof Map ? Object.fromEntries(value) : ((value ?? {}) as Record<string, string>)

export function serializeArticle(a: ArticleDoc) {
  return {
    id: String(a._id),
    title: a.title,
    excerpt: a.excerpt,
    image: a.image,
    category: a.category,
    author: { name: a.author?.name ?? { en: '', te: '' } },
    date: a.date,
  }
}

type Id = mongoose.Types.ObjectId | null | undefined

async function buildHome() {
  const [settings, categories, reels, quotes] = await Promise.all([
    getSettings(),
    Category.find().sort({ order: 1, createdAt: 1 }).lean(),
    Reel.find().sort({ order: 1, createdAt: 1 }).lean(),
    Quote.find().sort({ order: 1, createdAt: 1 }).lean(),
  ])

  const hp = settings.homepage
  const refs = [hp?.hero, ...(hp?.side ?? []), ...(hp?.latest ?? []), hp?.popularFeature, ...(hp?.popular ?? []), hp?.highlightFeature, ...(hp?.highlight ?? [])]
  const ids = [...new Set(refs.filter(Boolean).map(String))]
  const articles = (await Article.find({ _id: { $in: ids }, published: true }).lean()) as ArticleDoc[]
  const byId = new Map(articles.map((a) => [String(a._id), serializeArticle(a)]))
  const one = (id: Id) => (id && byId.has(String(id)) ? String(id) : null)
  const many = (list: Id[] = []) => list.map(String).filter((id) => byId.has(id))

  return {
    settings: {
      tagline: settings.tagline,
      instagram: settings.instagram,
      socials: settings.socials,
      contact: settings.contact,
      intro: settings.intro,
      subscribeUrl: settings.subscribeUrl,
      uiText: { en: plainMap(settings.uiText?.en), te: plainMap(settings.uiText?.te) },
    },
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, description: c.description })),
    ticker: settings.ticker,
    videos: settings.videos,
    reels: reels.map((r) => ({ id: String(r._id), category: r.category, caption: r.caption, video: r.video, poster: r.poster })),
    quotes: quotes.map((q) => ({ id: String(q._id), name: q.name, role: q.role, paragraphs: q.paragraphs })),
    articles: Object.fromEntries(byId),
    homepage: {
      hero: one(hp?.hero),
      side: many(hp?.side),
      latest: many(hp?.latest),
      popularFeature: one(hp?.popularFeature),
      popular: many(hp?.popular),
      highlightFeature: one(hp?.highlightFeature),
      highlight: many(hp?.highlight),
    },
  }
}

async function buildCategory(slug: string, page: number) {
  if (!(await Category.exists({ slug }))) throw notFound('No such category')
  const filter = { category: slug, published: true }
  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * CATEGORY_PAGE_SIZE)
      .limit(CATEGORY_PAGE_SIZE)
      .lean(),
    Article.countDocuments(filter),
  ])
  return { articles: (articles as ArticleDoc[]).map(serializeArticle), total, page, pageSize: CATEGORY_PAGE_SIZE }
}

export const contentRouter = Router()

contentRouter.get('/content', (req, res) => sendCachedJson(req, res, 'home', buildHome))

contentRouter.get('/categories/:slug/articles', (req, res) => {
  const slug = slugSchema.parse(req.params.slug)
  const page = Math.min(Math.max(1, Number(req.query.page) || 1), 1000)
  return sendCachedJson(req, res, `category:${slug}:${page}`, () => buildCategory(slug, page))
})
