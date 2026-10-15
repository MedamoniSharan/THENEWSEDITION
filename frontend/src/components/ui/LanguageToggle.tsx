import { useLanguage } from '../../i18n/language'
import { languages } from '../../i18n/types'
import { ui } from '../../i18n/ui'

const shortLabel = { en: 'EN', te: 'తెలుగు' } as const

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div role="group" aria-label={t.languageLabel} className="flex rounded-full bg-white p-1 shadow-sm">
      {languages.map((l) => {
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            lang={l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={ui[l].languageName}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? 'bg-accent text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {shortLabel[l]}
          </button>
        )
      })}
    </div>
  )
}
