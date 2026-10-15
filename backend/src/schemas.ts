import { z } from 'zod'

const text = (max: number) => z.string().trim().max(max)

export const localized = (max = 500) =>
  z
    .object({ en: text(max).default(''), te: text(max).default('') })
    .refine((v) => v.en || v.te, { message: 'Enter the text in English or Telugu' })

const optionalLocalized = (max = 500) => z.object({ en: text(max).default(''), te: text(max).default('') })

/** Site paths, uploaded media and http(s) links only, so admin-entered links can't run scripts. */
export const url = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === '' || v === '#' || v.startsWith('/') || /^https?:\/\//i.test(v), {
    message: 'Use a link starting with https://, or a site path starting with /',
  })

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id')

export const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes, e.g. political-news')
  .max(60)

export const categoryInput = z.object({
  slug,
  name: localized(80),
  description: optionalLocalized(300),
})

export const articleInput = z.object({
  title: localized(300),
  excerpt: optionalLocalized(2000),
  image: url,
  category: slug,
  author: z.object({ name: optionalLocalized(80) }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date like 2026-10-11'),
  published: z.boolean().default(true),
})

export const reelInput = z.object({
  category: slug,
  caption: optionalLocalized(200),
  video: url.refine(Boolean, 'Add a video'),
  poster: url,
})

export const quoteInput = z.object({
  name: localized(80),
  role: optionalLocalized(120),
  paragraphs: z.array(localized(1000)).max(6),
})

export const orderInput = z.object({ ids: z.array(objectId).max(500) })

export const youtubeVideo = z.object({
  youtubeId: z.string().regex(/^[\w-]{11}$/, 'Invalid YouTube video'),
  title: optionalLocalized(200),
  channel: text(120).default(''),
})

const uiTextMap = z.record(z.string().max(60), text(500))

export const settingsInput = z
  .object({
    tagline: optionalLocalized(200),
    ticker: z.array(localized(300)).max(50),
    homepage: z.object({
      hero: objectId.nullable(),
      side: z.array(objectId).max(6),
      latest: z.array(objectId).max(30),
      popularFeature: objectId.nullable(),
      popular: z.array(objectId).max(9),
      highlightFeature: objectId.nullable(),
      highlight: z.array(objectId).max(12),
    }),
    videos: z.array(youtubeVideo).max(20),
    instagram: z.object({ handle: text(60), url }),
    socials: z.object({ linkedin: url, instagram: url, x: url, facebook: url, youtube: url }),
    contact: z.object({ phone: text(40), email: z.union([z.literal(''), z.email()]), directionsUrl: url }),
    intro: z.object({ enabled: z.boolean(), video: url }),
    subscribeUrl: url,
    uiText: z.object({ en: uiTextMap, te: uiTextMap }),
  })
  .partial()

export const loginInput = z.object({ email: z.email(), password: z.string().min(1).max(200) })
export const passwordInput = z.object({
  current: z.string().min(1).max(200),
  next: z.string().min(8, 'Use at least 8 characters').max(200),
})
