import { useMemo, useState } from 'react'
import { RotateCcw, Search } from 'lucide-react'
import type { Language } from '../../i18n/types'
import { editableTextKeys, ui } from '../../i18n/ui'
import { useDraft, useSaveSettings, useSettings } from '../hooks'
import { Card, IconButton, Input, inputClass, LoadingBlock, PageHeader, SaveBar } from '../ui'

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())

export default function SiteText() {
  const { data, isPending } = useSettings()
  const save = useSaveSettings()
  const { draft, setDraft, dirty, reset } = useDraft(data?.uiText)
  const [query, setQuery] = useState('')

  const keys = useMemo(() => {
    const q = query.trim().toLowerCase()
    return editableTextKeys.filter((key) => !q || `${key} ${ui.en[key]} ${ui.te[key]}`.toLowerCase().includes(q))
  }, [query])

  if (isPending || !draft) return <LoadingBlock />

  const setText = (lang: Language, key: string, value: string) =>
    setDraft((d) => {
      const next = { ...d[lang] }
      if (value) next[key] = value
      else delete next[key]
      return { ...d, [lang]: next }
    })

  return (
    <>
      <PageHeader
        title="Site text"
        description="Reword the buttons, section titles and labels used across the website. Leave a box empty to use the original text shown in grey."
      />

      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search text in English or Telugu" className="pl-9" aria-label="Search site text" />
      </div>

      <Card>
        <ul className="divide-y divide-ink/5">
          {keys.map((key) => {
            const changed = Boolean(draft.en[key] || draft.te[key])
            return (
              <li key={key} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{humanize(key)}</p>
                  {changed && (
                    <IconButton
                      label="Use the original text"
                      onClick={() => {
                        setText('en', key, '')
                        setText('te', key, '')
                      }}
                    >
                      <RotateCcw size={14} />
                    </IconButton>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                  {(['en', 'te'] as const).map((lang) => (
                    <input
                      key={lang}
                      lang={lang}
                      aria-label={`${humanize(key)} (${lang === 'en' ? 'English' : 'Telugu'})`}
                      value={draft[lang][key] ?? ''}
                      placeholder={ui[lang][key]}
                      onChange={(e) => setText(lang, key, e.target.value)}
                      className={inputClass}
                    />
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      <SaveBar dirty={dirty} saving={save.isPending} onReset={reset} onSave={() => save.mutate({ uiText: draft })} />
    </>
  )
}
