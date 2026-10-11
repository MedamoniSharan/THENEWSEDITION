import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { latestArticles, type Article } from '../data/news'
import { articleHref } from '../hooks/useCategoryRoute'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../i18n/language'
import AuthorChip from './ui/AuthorChip'
import CategoryTag from './ui/CategoryTag'
import SectionHeader from './ui/SectionHeader'

const SPEED_PX_PER_SECOND = 40
/** How long auto-scroll waits after a swipe, wheel or arrow click before gliding again. */
const RESUME_DELAY_MS = 1500
const GAP_PX = 24

function holdUntil(ref: RefObject<number>, ms: number) {
  ref.current = performance.now() + ms
}

function LatestCard({ article, clone = false }: { article: Article; clone?: boolean }) {
  const { tr } = useLanguage()

  return (
    <article
      data-card={clone ? undefined : ''}
      data-clone={clone ? '' : undefined}
      aria-hidden={clone || undefined}
      inert={clone || undefined}
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
          <CategoryTag category={article.category} />
          <h3 className="mt-1 line-clamp-2 text-base leading-snug font-semibold text-ink">
            <a href={articleHref(article)} className="hover:text-accent">
              {tr(article.title)}
            </a>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/55">{tr(article.excerpt)}</p>
        </div>
        <div className="mt-2">
          <AuthorChip author={article.author} />
        </div>
      </div>
    </article>
  )
}

export default function LatestNews() {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const holdUntilRef = useRef(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const { t } = useLanguage()

  const autoPlaying = !userPaused && !reducedMotion
  const running = autoPlaying && !hovered && !focused

  /** Width of one full set of cards; scrolling this far shows the clones in the same spot as the originals. */
  const loopWidth = useCallback(() => {
    const el = trackRef.current
    const first = el?.querySelector<HTMLElement>('[data-card]')
    const firstClone = el?.querySelector<HTMLElement>('[data-clone]')
    return first && firstClone ? firstClone.offsetLeft - first.offsetLeft : 0
  }, [])

  const holdFor = (ms: number) => holdUntil(holdUntilRef, ms)

  useEffect(() => {
    if (!running) return
    const el = trackRef.current
    if (!el) return

    posRef.current = el.scrollLeft
    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const dt = Math.min(now - last, 50)
      last = now

      if (now < holdUntilRef.current) {
        posRef.current = el.scrollLeft
      } else {
        const width = loopWidth()
        if (Math.abs(el.scrollLeft - posRef.current) > 2) posRef.current = el.scrollLeft
        posRef.current += (SPEED_PX_PER_SECOND * dt) / 1000
        if (width > 0 && posRef.current >= width) posRef.current -= width
        el.scrollLeft = posRef.current
      }
      frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [running, loopWidth])

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + GAP_PX : el.clientWidth * 0.8
    const width = loopWidth()

    if (width > 0) {
      if (dir === -1 && el.scrollLeft < step) el.scrollLeft += width
      if (dir === 1 && el.scrollLeft >= width) el.scrollLeft -= width
    }
    holdFor(RESUME_DELAY_MS)
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const navButton = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={dir === 1 ? t.nextStories : t.previousStories}
      className="grid size-9 place-items-center rounded-xl bg-ink text-white transition-colors hover:bg-black"
    >
      {dir === 1 ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  )

  return (
    <section id="latest" className="scroll-mt-6 py-12 md:py-16">
      <SectionHeader
        title={t.latestNews}
        action={
          <div className="flex gap-2">
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? t.resumeAutoScroll : t.pauseAutoScroll}
                aria-pressed={userPaused}
                className="grid size-9 place-items-center rounded-xl bg-white text-ink shadow-sm transition-colors hover:bg-ink hover:text-white"
              >
                {userPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            )}
            {navButton(-1)}
            {navButton(1)}
          </div>
        }
      />

      <div
        ref={trackRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
        }}
        onTouchStart={() => holdFor(Infinity)}
        onTouchEnd={() => holdFor(RESUME_DELAY_MS)}
        onWheel={() => holdFor(RESUME_DELAY_MS)}
        aria-roledescription="carousel"
        aria-label={t.latestNews}
        className={`no-scrollbar -mx-4 flex scroll-px-4 gap-6 overflow-x-auto px-4 ${
          autoPlaying ? '' : 'snap-x snap-mandatory'
        }`}
      >
        {latestArticles.map((article) => (
          <LatestCard key={article.id} article={article} />
        ))}
        {latestArticles.map((article) => (
          <LatestCard key={`${article.id}-clone`} article={article} clone />
        ))}
      </div>
    </section>
  )
}
