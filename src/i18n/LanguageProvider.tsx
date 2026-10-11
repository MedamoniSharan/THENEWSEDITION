import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './language'
import { languages, type Language } from './types'
import { ui } from './ui'

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

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(savedLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Private browsing can block storage; the choice still applies for this visit.
    }
  }, [lang])

  const value = useMemo<LanguageContextValue>(() => {
    const dateFormat = new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'short', year: 'numeric' })
    return {
      lang,
      setLang,
      t: ui[lang],
      tr: (text) => text[lang],
      formatDate: (isoDate) => dateFormat.format(new Date(`${isoDate}T00:00:00`)),
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
