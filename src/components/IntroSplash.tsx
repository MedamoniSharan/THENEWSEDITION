import { useCallback, useEffect, useRef, useState } from 'react'

const FADE_MS = 600
/** Skip the intro if the video hasn't started by then (slow network). */
const START_TIMEOUT_MS = 4000
const MAX_DURATION_MS = 12000
/** Events that count as a user gesture, which browsers require before playing sound. */
const GESTURE_EVENTS = ['pointerup', 'keydown', 'touchend'] as const

/** The inline script in `index.html` adds this class when the intro should play. */
const introPending = () => document.documentElement.classList.contains('intro-pending')

export default function IntroSplash() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'playing' | 'leaving' | 'done'>(() => (introPending() ? 'playing' : 'done'))
  /** Browsers block sound until the visitor interacts; the first gesture then turns it on. */
  const [blockedByBrowser, setBlockedByBrowser] = useState(false)

  const finish = useCallback(() => setPhase((p) => (p === 'playing' ? 'leaving' : p)), [])

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
    const onGesture = () => {
      if (videoRef.current) videoRef.current.muted = false
      setBlockedByBrowser(false)
    }
    GESTURE_EVENTS.forEach((type) => document.addEventListener(type, onGesture, { capture: true }))
    return () => GESTURE_EVENTS.forEach((type) => document.removeEventListener(type, onGesture, { capture: true }))
  }, [blockedByBrowser])

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
    </div>
  )
}
