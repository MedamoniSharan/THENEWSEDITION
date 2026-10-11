import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '../i18n/language'

const FADE_MS = 600
/** Skip the intro if the video hasn't started by then (slow network). */
const START_TIMEOUT_MS = 4000
const MAX_DURATION_MS = 12000
/** Events that count as a user gesture, which browsers require before playing sound. */
const GESTURE_EVENTS = ['pointerup', 'keydown', 'touchend'] as const

/** The inline script in `index.html` adds this class when the intro should play. */
const introPending = () => document.documentElement.classList.contains('intro-pending')

export default function IntroSplash() {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'playing' | 'leaving' | 'done'>(() => (introPending() ? 'playing' : 'done'))
  const [muted, setMuted] = useState(false)
  /** Browsers block sound until the visitor interacts; the first gesture then turns it on. */
  const [blockedByBrowser, setBlockedByBrowser] = useState(false)

  const finish = useCallback(() => setPhase((p) => (p === 'playing' ? 'leaving' : p)), [])

  const applyMuted = useCallback((next: boolean) => {
    const video = videoRef.current
    if (video) video.muted = next
    setMuted(next)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    const video = videoRef.current
    if (!video) return
    let cancelled = false

    video.muted = false
    video.play().catch((err: DOMException) => {
      if (cancelled) return
      if (err.name !== 'NotAllowedError') return finish()
      video.muted = true
      setMuted(true)
      setBlockedByBrowser(true)
      video.play().catch(() => !cancelled && finish())
    })

    const startTimer = setTimeout(() => {
      if (video.currentTime === 0) finish()
    }, START_TIMEOUT_MS)
    const maxTimer = setTimeout(finish, MAX_DURATION_MS)
    return () => {
      cancelled = true
      clearTimeout(startTimer)
      clearTimeout(maxTimer)
    }
  }, [phase, finish])

  useEffect(() => {
    if (!blockedByBrowser) return
    const onGesture = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('[data-sound-toggle]')) return
      applyMuted(false)
      setBlockedByBrowser(false)
    }
    GESTURE_EVENTS.forEach((type) => document.addEventListener(type, onGesture, { capture: true }))
    return () => GESTURE_EVENTS.forEach((type) => document.removeEventListener(type, onGesture, { capture: true }))
  }, [blockedByBrowser, applyMuted])

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
      <div className="absolute right-5 bottom-5 flex gap-2">
        <button
          type="button"
          data-sound-toggle
          onClick={() => {
            applyMuted(!muted)
            setBlockedByBrowser(false)
          }}
          aria-label={muted ? t.unmuteIntro : t.muteIntro}
          aria-pressed={muted}
          className="grid size-9 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          type="button"
          onClick={finish}
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
        >
          {t.skipIntro}
        </button>
      </div>
    </div>
  )
}
