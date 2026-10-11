import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { latestArticles } from '../data/news'
import AuthorChip from './ui/AuthorChip'
import SectionHeader from './ui/SectionHeader'

export default function LatestNews() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateButtons = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateButtons()
    window.addEventListener('resize', updateButtons)
    return () => window.removeEventListener('resize', updateButtons)
  }, [updateButtons])

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const navButton = (dir: 1 | -1, enabled: boolean) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      disabled={!enabled}
      aria-label={dir === 1 ? 'Next stories' : 'Previous stories'}
      className={`grid size-9 place-items-center rounded-xl transition-colors ${
        enabled ? 'bg-ink text-white hover:bg-black' : 'bg-ink/10 text-ink/40'
      }`}
    >
      {dir === 1 ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  )

  return (
    <section className="py-12 md:py-16">
      <SectionHeader
        title="Latest News"
        action={
          <div className="flex gap-2">
            {navButton(-1, canPrev)}
            {navButton(1, canNext)}
          </div>
        }
      />

      <div
        ref={trackRef}
        onScroll={updateButtons}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto scroll-smooth px-4"
      >
        {latestArticles.map((article) => (
          <article
            key={article.id}
            data-card
            className="group flex w-[85%] shrink-0 snap-start gap-4 sm:w-[420px]"
          >
            <div className="h-32 w-36 shrink-0 overflow-hidden rounded-2xl sm:w-40">
              <img
                src={article.image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-between py-0.5">
              <div>
                <h3 className="line-clamp-3 text-base leading-snug font-semibold text-ink">
                  <a href="#" className="hover:text-accent">
                    {article.title}
                  </a>
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/55">
                  {article.excerpt}
                </p>
              </div>
              <div className="mt-2">
                <AuthorChip author={article.author} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
