import { useId, type ReactNode } from 'react'
import type { Language, Localized } from '../i18n/types'
import { Badge, inputClass } from './ui'

const languageLabels: Record<Language, string> = { en: 'English', te: 'తెలుగు' }

interface BilingualFieldProps {
  label: string
  value: Localized
  onChange: (value: Localized) => void
  multiline?: boolean
  rows?: number
  required?: boolean
  hint?: ReactNode
  placeholder?: Partial<Localized>
  /** Hides the label row, for compact repeated rows like ticker headlines. */
  compact?: boolean
}

/** One piece of content edited side by side in English and Telugu. */
export default function BilingualField({ label, value, onChange, multiline, rows = 3, required, hint, placeholder, compact }: BilingualFieldProps) {
  const id = useId()
  const missing: Language | null = value.en.trim() && !value.te.trim() ? 'te' : value.te.trim() && !value.en.trim() ? 'en' : null

  return (
    <fieldset>
      {compact ? (
        <legend className="sr-only">{label}</legend>
      ) : (
        <legend className="mb-1.5 flex w-full items-center gap-2 text-sm font-semibold text-ink">
          {label}
          {required && <span className="text-accent">*</span>}
          {missing && <Badge tone="warning">{missing === 'te' ? 'Telugu missing' : 'English missing'}</Badge>}
        </legend>
      )}
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
        {(['en', 'te'] as const).map((lang) => {
          const props = {
            id: `${id}-${lang}`,
            lang,
            value: value[lang],
            placeholder: placeholder?.[lang] ?? (lang === 'en' ? 'In English' : 'తెలుగులో'),
            onChange: (e: { target: { value: string } }) => onChange({ ...value, [lang]: e.target.value }),
            className: `${inputClass} ${multiline ? 'min-h-20 resize-y leading-relaxed' : ''} ${
              missing === lang ? 'border-amber-300' : ''
            }`,
          }
          return (
            <div key={lang} className="relative">
              <label htmlFor={props.id} className="mb-1 block text-[11px] font-semibold tracking-wide text-ink/45 uppercase">
                {languageLabels[lang]}
              </label>
              {multiline ? <textarea rows={rows} {...props} /> : <input {...props} />}
            </div>
          )
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink/50">{hint}</p>}
    </fieldset>
  )
}
