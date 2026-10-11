import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/language'

const FADE_MS = 600
/** Skip the intro if the video hasn't started by then (slow network). */
const START_TIMEOUT_MS = 4000
const MAX_DURATION_MS = 12000

/** The inline script in `index.html` adds this class when the intro should play. */
const introPending = () => document.documentElement.classList.contains('intro-pending')

/**
 * `starting`: trying to autoplay with sound. `waiting`: the browser blocked sound, so we wait for a tap,
 * which browsers accept as permission to play audio.
 */
type Phase = 'starting' | 'waiting' | 'playing' | 'leaving' | 'done'

export default function IntroSplash() {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const tapRef = useRef<HTMLButtonElement>(null)
  const [phase, setPhase] = useState<Phase>(() => (introPending() ? 'starting' : 'done'))

  const finish = useCallback(
    () => setPhase((p) => (p === 'starting' || p === 'waiting' || p === 'playing' ? 'leaving' : p)),
    [],
  )

  useEffect(() => {
    if (phase !== 'starting') return
    const video = videoRef.current
    if (!video) return
    let cancelled = false

    video.muted = false
    video
      .play()
      .then(() => !cancelled && setPhase('playing'))
      .catch((err: DOMException) => {
        if (cancelled) return
        if (err.name === 'NotAllowedError') setPhase('waiting')
        else finish()
      })

    const timer = setTimeout(finish, START_TIMEOUT_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [phase, finish])

  useEffect(() => {
    if (phase === 'waiting') tapRef.current?.focus()
    if (phase !== 'playing') return
    const timer = setTimeout(finish, MAX_DURATION_MS)
    return () => clearTimeout(timer)
  }, [phase, finish])

  useEffect(() => {
    if (phase !== 'leaving') return
    document.documentElement.classList.remove('intro-pending')

    const video = videoRef.current
    const startVolume = video?.volume ?? 1
    const start = performance.now()
    const fade = setInterval(() => {
      if (video) video.volume = startVolume * Math.max(0, 1 - (performance.now() - start) / FADE_MS)
    }, 50)
    const timer = setTimeout(() => setPhase('done'), FADE_MS)
    return () => {
      clearInterval(fade)
      clearTimeout(timer)
    }
  }, [phase])

  const playAfterTap = () => {
    const video = videoRef.current
    if (!video) return finish()
    video.muted = false
    video.currentTime = 0
    video
      .play()
      .then(() => setPhase('playing'))
      .catch(finish)
  }

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[600ms] ${
        phase === 'leaving' ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      <video
        ref={videoRef}
        src="/intro/intro.mp4"
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        aria-hidden
        className="size-full object-contain portrait:scale-125"
      />
      {phase === 'waiting' && (
        <button
          ref={tapRef}
          type="button"
          onClick={playAfterTap}
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black text-white outline-none"
        >
          <img src="/brand/logo-badge.webp" width={320} height={306} alt="" className="h-28 w-auto md:h-36" />
          <span className="animate-pulse rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold tracking-wide">
            {t.tapToEnter}
          </span>
        </button>
      )}
    </div>
  )
}
