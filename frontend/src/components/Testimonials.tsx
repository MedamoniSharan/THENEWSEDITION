import { useContent } from '../content/context'
import type { Quote } from '../content/types'
import { useLanguage } from '../i18n/language'
import NewsReelTile from './NewsReelTile'

type Tile = { kind: 'brand' } | { kind: 'reel'; start: number } | { kind: 'quote'; quote: Quote }

/** Brand tile first, then reels and reader quotes alternate; each reel tile starts at a different clip. */
function buildTiles(quotes: Quote[], reelCount: number): Tile[] {
  const reel = (i: number): Tile[] => (reelCount ? [{ kind: 'reel', start: (i * 3 + 2) % reelCount }] : [])
  return [
    { kind: 'brand' },
    ...quotes.flatMap((quote, i): Tile[] => [...reel(i), { kind: 'quote', quote }]),
    ...reel(quotes.length),
  ]
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TileView({ tile, className = '' }: { tile: Tile; className?: string }) {
  const { t, tr } = useLanguage()

  if (tile.kind === 'brand') {
    return (
      <div className={`relative flex flex-col overflow-hidden rounded-2xl bg-accent p-5 ${className}`}>
        <img
          src="/brand/logo-badge.webp"
          alt="The News Edition"
          width={320}
          height={306}
          loading="lazy"
          className="h-11 w-auto self-start"
        />
        <p className="mt-auto rotate-180 self-start text-[2.6rem] leading-[0.95] font-bold tracking-tight text-white [writing-mode:vertical-rl] sm:text-5xl lg:text-[3.25rem]">
          {t.realFeedback[0]}
          <br />
          {t.realFeedback[1]}
        </p>
      </div>
    )
  }

  if (tile.kind === 'reel') {
    return <NewsReelTile start={tile.start} className={className} />
  }

  const { quote } = tile
  return (
    <figure className={`flex flex-col rounded-2xl bg-white p-4 sm:p-5 ${className}`}>
      <figcaption>
        <p className="text-base leading-tight font-bold text-ink sm:text-xl">{tr(quote.name)}</p>
        {tr(quote.role) && <p className="mt-0.5 text-xs font-bold text-ink sm:text-sm">({tr(quote.role)})</p>}
      </figcaption>
      <blockquote className="mt-4 space-y-3 text-xs leading-relaxed text-ink/80 sm:mt-5 sm:space-y-4 sm:text-[13px]">
        {quote.paragraphs.map((p, i) => (
          <p key={i}>{tr(p)}</p>
        ))}
      </blockquote>
    </figure>
  )
}

export default function Testimonials() {
  const { t } = useLanguage()
  const { quotes, reels, settings } = useContent()
  if (quotes.length === 0 && reels.length === 0) return null

  const tiles = buildTiles(quotes, reels.length)
  // On the three-column layout a single tile left on the last row looks unfinished, so it's hidden there.
  const hideLastOnTablet = tiles.length % 3 === 1

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-ink py-12 md:py-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between md:pb-10">
          <div className="flex items-center gap-4">
            <InstagramIcon className="size-12 shrink-0 text-white md:size-14" />
            <div>
              <h2 id="testimonials-title" className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
                <a href={settings.instagram.url || undefined} className="hover:text-white/80">
                  {t.followUs} {settings.instagram.handle}
                </a>
              </h2>
              <p className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                {t.realReaders}
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-white/70 md:text-right">{t.testimonialsIntro}</p>
        </div>

        <div className="grid auto-rows-[minmax(250px,auto)] grid-cols-2 gap-2.5 sm:grid-cols-3 lg:auto-rows-[minmax(max(300px,24vw),auto)] lg:grid-cols-5">
          {tiles.map((tile, i) => (
            <TileView
              key={tile.kind === 'quote' ? tile.quote.id : `${tile.kind}-${i}`}
              tile={tile}
              className={hideLastOnTablet && i === tiles.length - 1 ? 'sm:max-lg:hidden' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
