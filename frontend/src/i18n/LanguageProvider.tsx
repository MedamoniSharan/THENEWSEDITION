import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './language'
import { languages, type Language, type Localized } from './types'
import { ui, withOverrides } from './ui'

const STORAGE_KEY = 'tne-language'

const locales: Record<Language, string> = { en: 'en-IN', te: 'te-IN' }

function savedLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return languages.find((l) => l === saved) ?? 'en'
  } catch {
    return 'en'
  }
}

interface LanguageProviderProps {
  children: ReactNode
  /** Interface text edited in the admin dashboard, keyed by language then string key. */
  overrides?: Partial<Record<Language, Record<string, string>>>
}

export default function LanguageProvider({ children, overrides }: LanguageProviderProps) {
  const [lang, setLang] = useState(savedLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Private browsing can block storage; the choice still applies for this visit.
    }
  }, [lang])

  const langOverrides = overrides?.[lang]
  const value = useMemo<LanguageContextValue>(() => {
    const dateFormat = new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'short', year: 'numeric' })
    const other: Language = lang === 'en' ? 'te' : 'en'
    return {
      lang,
      setLang,
      t: withOverrides(ui[lang], langOverrides),
      // Falls back to the other language so a missing translation never leaves a blank.
      tr: (text?: Localized) => text?.[lang] || text?.[other] || '',
      formatDate: (isoDate) => dateFormat.format(new Date(`${isoDate}T00:00:00`)),
    }
  }, [lang, langOverrides])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
