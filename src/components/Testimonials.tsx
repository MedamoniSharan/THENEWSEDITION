import { instagram, testimonialTiles, type TestimonialTile } from '../data/testimonials'
import { useLanguage } from '../i18n/language'
import NewsReelTile from './NewsReelTile'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Tile({ tile, className = '' }: { tile: TestimonialTile; className?: string }) {
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

  return (
    <figure className={`flex flex-col rounded-2xl bg-white p-4 sm:p-5 ${className}`}>
      <figcaption>
        <p className="text-base leading-tight font-bold text-ink sm:text-xl">{tr(tile.name)}</p>
        <p className="mt-0.5 text-xs font-bold text-ink sm:text-sm">({tr(tile.role)})</p>
      </figcaption>
      <blockquote className="mt-4 space-y-3 text-xs leading-relaxed text-ink/80 sm:mt-5 sm:space-y-4 sm:text-[13px]">
        {tile.paragraphs.map((p) => (
          <p key={p.en}>{tr(p)}</p>
        ))}
      </blockquote>
    </figure>
  )
}

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-ink py-12 md:py-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between md:pb-10">
          <div className="flex items-center gap-4">
            <InstagramIcon className="size-12 shrink-0 text-white md:size-14" />
            <div>
              <h2 id="testimonials-title" className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
                <a href={instagram.url} className="hover:text-white/80">
                  {t.followUs} {instagram.handle}
                </a>
              </h2>
              <p className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                {t.realReaders}
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-white/70 md:text-right">
            {t.testimonialsIntro}
          </p>
        </div>

        <div className="grid auto-rows-[minmax(250px,auto)] grid-cols-2 gap-2.5 sm:grid-cols-3 lg:auto-rows-[minmax(max(300px,24vw),auto)] lg:grid-cols-5">
          {testimonialTiles.map((tile, i) => (
            <Tile
              key={i}
              tile={tile}
              className={i === testimonialTiles.length - 1 ? 'sm:max-lg:hidden' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
