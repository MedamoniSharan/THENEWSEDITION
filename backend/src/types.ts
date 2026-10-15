export const languages = ['en', 'te'] as const
export type Language = (typeof languages)[number]
export type Localized = Record<Language, string>
