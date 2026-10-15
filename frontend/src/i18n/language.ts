import { createContext, useContext } from 'react'
import type { UiStrings } from './ui'
import type { Language, Localized } from './types'

export interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  /** Interface strings in the current language. */
  t: UiStrings
  /** Picks the current language out of a piece of bilingual content. */
  tr: (text?: Localized) => string
  /** Formats an ISO date (`2026-10-11`) for the current language. */
  formatDate: (isoDate: string) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return value
}
