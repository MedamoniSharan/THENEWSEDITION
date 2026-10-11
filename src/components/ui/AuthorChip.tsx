import type { Author } from '../../data/news'

interface AuthorChipProps {
  author: Author
  date?: string
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md'
}

export default function AuthorChip({ author, date, variant = 'light', size = 'sm' }: AuthorChipProps) {
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
      <span className={`text-xs font-medium ${name}`}>{author.name}</span>
      {date && (
        <>
          <span className={`text-xs ${meta}`} aria-hidden>
            ·
          </span>
          <time className={`text-xs ${meta}`}>{date}</time>
        </>
      )}
    </div>
  )
}
