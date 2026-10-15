import type { Homepage, Socials, YouTubeVideo } from '../content/types'
import type { Language, Localized } from '../i18n/types'

interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface ArticleRecord extends Timestamps {
  id: string
  title: Localized
  excerpt: Localized
  image: string
  category: string
  author: { name: Localized }
  date: string
  published: boolean
}

export interface CategoryRecord extends Timestamps {
  id: string
  slug: string
  name: Localized
  description: Localized
  order: number
}

export interface ReelRecord extends Timestamps {
  id: string
  category: string
  caption: Localized
  video: string
  poster: string
  order: number
}

export interface QuoteRecord extends Timestamps {
  id: string
  name: Localized
  role: Localized
  paragraphs: Localized[]
  order: number
}

export interface SettingsRecord {
  tagline: Localized
  ticker: Localized[]
  homepage: Homepage
  videos: YouTubeVideo[]
  instagram: { handle: string; url: string }
  socials: Socials
  contact: { phone: string; email: string; directionsUrl: string }
  intro: { enabled: boolean; video: string }
  subscribeUrl: string
  uiText: Record<Language, Record<string, string>>
}

export interface Asset {
  id: string
  url: string
  kind: 'image' | 'video'
  filename: string
  mime: string
  size: number
  width: number | null
  height: number | null
  createdAt: string
}

export interface Stats {
  articles: number
  published: number
  missingTelugu: number
  categories: number
  reels: number
  quotes: number
  media: number
  perCategory: Record<string, number>
}

export const emptyLocalized = (): Localized => ({ en: '', te: '' })
