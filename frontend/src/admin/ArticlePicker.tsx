import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { ArticleThumb } from './pages/Articles'
import type { ArticleRecord } from './types'
import { inputClass } from './ui'

interface ArticlePickerProps {
  articles: ArticleRecord[]
  exclude: string[]
  onPick: (article: ArticleRecord) => void
  placeholder?: string
}

/** Search box that lists matching stories (English or Telugu) and adds the one clicked. */
export default function ArticlePicker({ articles, exclude, onPick, placeholder = 'Search a story to add…' }: ArticlePickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles
      .filter((a) => !exclude.includes(a.id) && (!q || `${a.title.en} ${a.title.te}`.toLowerCase().includes(q)))
      .slice(0, 8)
  }, [articles, exclude, query])

  return (
    <div className="relative">
      <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${inputClass} pl-9`}
      />
      {open && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-xl bg-white p-1 shadow-xl ring-1 ring-ink/10">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink/50">No matching stories</li>
          ) : (
            results.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  // mousedown fires before the input's blur closes the list.
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onPick(a)
                    setQuery('')
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-paper"
                >
                  <ArticleThumb src={a.image} className="h-9 w-12" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{a.title.en || a.title.te}</span>
                    <span className="block truncate text-xs text-ink/45">
                      {a.category} · {a.date}
                      {!a.published && ' · draft'}
                    </span>
                  </span>
                  <Plus size={15} className="shrink-0 text-ink/40" />
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
