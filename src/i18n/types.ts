export const languages = ['en', 'te'] as const

export type Language = (typeof languages)[number]

/** A piece of content written in every supported language. */
export type Localized = Record<Language, string>
