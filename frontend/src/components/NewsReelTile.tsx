import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { mediaUrl } from '../content/api'
import { useContent } from '../content/context'
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../i18n/language'
import CategoryTag from './ui/CategoryTag'

interface NewsReelTileProps {
  start: number
  className?: string
}

export default function NewsReelTile({ start, className = '' }: NewsReelTileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const { t, tr } = useLanguage()
  const { reels: newsReels, categories, settings } = useContent()

  const position = step % newsReels.length
  const reel = newsReels[(start + step) % newsReels.length]
  const caption = tr(reel.caption)
  const shouldPlay = visible && playing

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (shouldPlay) {
      video.play().catch((err: DOMException) => {
        if (err.name === 'NotAllowedError') setPlaying(false)
      })
    } else {
      video.pause()
    }
  }, [shouldPlay, reel])

  const next = () => {
    setStep((s) => s + 1)
    setProgress(0)
  }

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl bg-ink-soft ${className}`}
    >
      <video
        ref={videoRef}
        src={mediaUrl(reel.video)}
        poster={reel.poster ? mediaUrl(reel.poster) : undefined}
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget
          if (duration) setProgress(currentTime / duration)
        }}
        onEnded={next}
        aria-label={t.reelLabel(tr(categories.find((c) => c.slug === reel.category)?.name), caption)}
        className="absolute inset-0 size-full object-cover"
      />

      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent p-3 pb-8">
        <div className="flex gap-1" aria-hidden>
          {newsReels.map((r, i) => (
            <span key={r.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/35">
              <span
                className="block h-full bg-white transition-[width] duration-300 ease-linear"
                style={{ width: `${i < position ? 100 : i === position ? progress * 100 : 0}%` }}
              />
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <CategoryTag category={reel.category} variant="pill" />
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t.pauseReel : t.playReel}
            className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-white">
        <p className="text-sm leading-snug font-semibold">{caption}</p>
        <p className="mt-1.5 text-[10px] font-medium tracking-wide text-white/70 uppercase">
          {settings.instagram.handle}
        </p>
      </div>
    </div>
  )
}
