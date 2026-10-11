import { Zap } from 'lucide-react'
import { tickerHeadlines } from '../data/news'
import { useLanguage } from '../i18n/language'

export default function Ticker() {
  const { t, tr } = useLanguage()
  const items = [...tickerHeadlines, ...tickerHeadlines]

  return (
    <section
      aria-label={t.breakingNews}
      className="mt-8 flex items-center gap-4 overflow-hidden rounded-full bg-white p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
        <Zap size={14} className="fill-accent text-accent" />
        {t.hotNews}
      </span>
      <div className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <ul className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {items.map((headline, i) => (
            <li
              key={i}
              aria-hidden={i >= tickerHeadlines.length}
              className="flex items-center gap-10 pr-10 text-sm whitespace-nowrap text-ink/70"
            >
              <a href="#" className="hover:text-accent">
                {tr(headline)}
              </a>
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
