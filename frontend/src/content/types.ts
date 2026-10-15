import type { Language, Localized } from '../i18n/types'

export interface Category {
  slug: string
  name: Localized
  description: Localized
}

export interface Author {
  name: Localized
}

export interface Article {
  id: string
  title: Localized
  excerpt: Localized
  image: string
  category: string
  author: Author
  /** ISO date, formatted per language when shown. */
  date: string
}

export interface Reel {
  id: string
  category: string
  caption: Localized
  video: string
  poster: string
}

export interface Quote {
  id: string
  name: Localized
  role: Localized
  paragraphs: Localized[]
}

export interface YouTubeVideo {
  youtubeId: string
  title: Localized
  channel: string
}

export interface Socials {
  linkedin: string
  instagram: string
  x: string
  facebook: string
  youtube: string
}

export interface SiteSettings {
  tagline: Localized
  instagram: { handle: string; url: string }
  socials: Socials
  contact: { phone: string; email: string; directionsUrl: string }
  intro: { enabled: boolean; video: string }
  subscribeUrl: string
  uiText: Record<Language, Record<string, string>>
}

/** Article ids placed in each homepage section, in display order. */
export interface Homepage<Id = string> {
  hero: Id | null
  side: Id[]
  latest: Id[]
  popularFeature: Id | null
  popular: Id[]
  highlightFeature: Id | null
  highlight: Id[]
}

export interface SiteContent {
  settings: SiteSettings
  categories: Category[]
  ticker: Localized[]
  videos: YouTubeVideo[]
  reels: Reel[]
  quotes: Quote[]
  /** Only the articles placed on the homepage; category pages load theirs separately. */
  articles: Record<string, Article>
  homepage: Homepage
}

export interface CategoryArticlesPage {
  articles: Article[]
  total: number
  page: number
  pageSize: number
}
