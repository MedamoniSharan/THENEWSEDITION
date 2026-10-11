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
  const avatar = size === 'md' ? 'size-8' : 'size-6'
  const name = variant === 'dark' ? 'text-white' : 'text-ink'
  const meta = variant === 'dark' ? 'text-white/60' : 'text-ink/50'

  return (
    <div className="flex items-center gap-2">
      <img
        src={author.avatar}
        alt=""
        loading="lazy"
        className={`${avatar} rounded-full object-cover ring-2 ${variant === 'dark' ? 'ring-white/20' : 'ring-white'}`}
      />
      <span className={`text-xs font-medium ${name}`}>{tr(author.name)}</span>
      {date && (
        <>
          <span className={`text-xs ${meta}`} aria-hidden>
            ·
          </span>
          <time dateTime={date} className={`text-xs ${meta}`}>
            {formatDate(date)}
          </time>
        </>
      )}
    </div>
  )
}
