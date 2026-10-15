import { Article, Category, Quote, Reel, Settings } from '../models.ts'
import {
  categories,
  heroArticle,
  highlightArticles,
  highlightFeature,
  latestArticles,
  moreArticles,
  popularArticles,
  popularFeature,
  sideArticles,
  tickerHeadlines,
  type Article as SeedArticle,
} from './news.ts'
import { instagram, newsReels, testimonialTiles } from './testimonials.ts'

async function insertArticles(list: SeedArticle[]) {
  const docs = await Article.insertMany(list.map(({ id: _id, ...article }) => ({ ...article, published: true })))
  return docs.map((d) => d._id)
}

/** Fills the database with the launch content. With `reset`, existing content is deleted first; admins and uploads are kept. */
export async function seed({ reset = false } = {}) {
  if (reset) {
    await Promise.all([
      Category.deleteMany({}),
      Article.deleteMany({}),
      Reel.deleteMany({}),
      Quote.deleteMany({}),
      Settings.deleteMany({}),
    ])
  }

  await Category.insertMany(categories.map((c, order) => ({ ...c, order })))

  const [hero] = await insertArticles([heroArticle])
  const side = await insertArticles(sideArticles)
  const latest = await insertArticles(latestArticles)
  const [popularLead] = await insertArticles([popularFeature])
  const popular = await insertArticles(popularArticles)
  const [highlightLead] = await insertArticles([highlightFeature])
  const highlight = await insertArticles(highlightArticles)
  await insertArticles(moreArticles)

  await Reel.insertMany(
    newsReels.map((r, order) => ({
      category: r.category,
      caption: r.caption,
      video: `/reels/${r.category}.mp4`,
      poster: `/reels/${r.category}.webp`,
      order,
    })),
  )

  await Quote.insertMany(
    testimonialTiles.flatMap((tile, order) =>
      tile.kind === 'quote' ? [{ name: tile.name, role: tile.role, paragraphs: tile.paragraphs, order }] : [],
    ),
  )

  await Settings.create({
    key: 'site',
    tagline: { en: 'Find News that Meet With Your Needs', te: 'మీ అవసరాలకు తగిన వార్తలు ఇక్కడే' },
    ticker: tickerHeadlines,
    homepage: {
      hero,
      side,
      latest,
      popularFeature: popularLead,
      popular,
      highlightFeature: highlightLead,
      highlight,
    },
    videos: [
      { youtubeId: 'bYBchF0RFAo', title: { en: 'Saleswaram Song', te: 'సలేశ్వరం పాట' }, channel: 'Aashvi Sahasra Digitals' },
    ],
    instagram,
    socials: { linkedin: '#', instagram: '#', x: '#', facebook: '#', youtube: '' },
    contact: { phone: '+1 (123) 456-7890', email: 'hello@thenewsedition.com', directionsUrl: '#' },
    intro: { enabled: true, video: '/intro/intro.mp4' },
    subscribeUrl: '',
  })
}

export async function seedIfEmpty() {
  if (await Settings.exists({ key: 'site' })) return
  await seed()
  console.log('Database was empty: added the launch content')
}
