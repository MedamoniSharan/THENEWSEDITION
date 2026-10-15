import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../../i18n/language'

interface SectionHeaderProps {
  title: string
  variant?: 'light' | 'dark'
  href?: string
  /** Replaces the default "View More" button. */
  action?: ReactNode
}

export default function SectionHeader({ title, variant = 'light', href = '#', action }: SectionHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2
        className={`text-2xl font-semibold tracking-tight md:text-3xl ${variant === 'dark' ? 'text-white' : 'text-ink'}`}
      >
        {title}
      </h2>
      {action ?? (
        <a
          href={href}
          className="group inline-flex items-center gap-1.5 rounded-full bg-accent py-1.5 pr-1.5 pl-4 text-xs font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          {t.viewMore}
          <span className="grid size-6 place-items-center rounded-full bg-white text-accent">
            <ArrowUpRight
              size={14}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </a>
      )}
    </div>
  )
}
