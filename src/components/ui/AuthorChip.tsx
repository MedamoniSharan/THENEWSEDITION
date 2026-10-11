import type { Author } from '../../data/news'
import { useLanguage } from '../../i18n/language'

interface AuthorChipProps {
  author: Author
  /** ISO date. */
  date?: string
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md'
}

export default function AuthorChip({ author, date, variant = 'light', size = 'sm' }: AuthorChipProps) {
  const { tr, formatDate } = useLanguage()
  const text = size === 'md' ? 'text-sm' : 'text-xs'
  const name = variant === 'dark' ? 'text-white' : 'text-ink'
  const meta = variant === 'dark' ? 'text-white/60' : 'text-ink/50'

  return (
    <div className={`flex items-center gap-2 ${text}`}>
      <span className={`font-medium ${name}`}>{tr(author.name)}</span>
      {date && (
        <>
          <span className={meta} aria-hidden>
            ·
          </span>
          <time dateTime={date} className={meta}>
            {formatDate(date)}
          </time>
        </>
      )}
    </div>
  )
}
