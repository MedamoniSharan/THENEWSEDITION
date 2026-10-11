import { useCallback, useEffect, useRef, useState } from 'react'
import { featuredVideo, youtubeWatchUrl } from '../data/videos'
import { useLanguage } from '../i18n/language'
import SectionHeader from './ui/SectionHeader'

const YT_ORIGIN = 'https://www.youtube.com'
const GESTURE_EVENTS = ['pointerup', 'keydown', 'touchend'] as const
const PLAYING = 1
const UNMUTE_CHECK_MS = 800

function embedUrl(id: string) {
  const params = new URLSearchParams({
    autoplay: '1',
    // Browsers only allow embeds to autoplay muted; sound is switched on after the visitor interacts.
    mute: '1',
    playsinline: '1',
    loop: '1',
    playlist: id,
    rel: '0',
    enablejsapi: '1',
    origin: window.location.origin,
  })
  return `${YT_ORIGIN}/embed/${id}?${params}`
}

export default function YouTubeSection() {
  const { t, tr } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerState = useRef<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)
  const title = tr(featuredVideo.title)

  const send = useCallback((message: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(message), YT_ORIGIN)
  }, [])
  const command = useCallback((func: string) => send({ event: 'command', func, args: [] }), [send])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!mounted) return
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== YT_ORIGIN || event.source !== iframeRef.current?.contentWindow) return
      let data: { event?: string; info?: { playerState?: number } }
      try {
        data = JSON.parse(event.data)
      } catch {
        return
      }
      if (data.event === 'onReady' || data.event === 'initialDelivery') setReady(true)
      if (typeof data.info?.playerState === 'number') playerState.current = data.info.playerState
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [mounted])

  // The player only reports back once the page announces it is listening.
  useEffect(() => {
    if (!mounted || ready) return
    const id = window.setInterval(() => send({ event: 'listening', id: 'tne-youtube', channel: 'widget' }), 250)
    return () => window.clearInterval(id)
  }, [mounted, ready, send])

  useEffect(() => {
    if (ready) command(inView ? 'playVideo' : 'pauseVideo')
  }, [ready, inView, command])

  useEffect(() => {
    if (!ready) return
    let checkTimer: number | undefined

    const unmute = () => {
      command('unMute')
      // Some browsers pause instead of unmuting without a gesture inside the frame; keep it playing muted then.
      checkTimer = window.setTimeout(() => {
        if (playerState.current !== PLAYING) {
          command('mute')
          command('playVideo')
        }
      }, UNMUTE_CHECK_MS)
    }

    if (navigator.userActivation?.hasBeenActive) {
      unmute()
      return () => window.clearTimeout(checkTimer)
    }

    const onGesture = () => {
      removeListeners()
      unmute()
    }
    const removeListeners = () => GESTURE_EVENTS.forEach((e) => document.removeEventListener(e, onGesture, true))
    GESTURE_EVENTS.forEach((e) => document.addEventListener(e, onGesture, true))
    return () => {
      removeListeners()
      window.clearTimeout(checkTimer)
    }
  }, [ready, command])

  return (
    <section ref={sectionRef} id="videos" className="scroll-mt-6 py-14 md:py-20">
      <SectionHeader
        title={t.videos}
        action={
          <a
            href={youtubeWatchUrl(featuredVideo.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent py-1.5 pr-4 pl-3 text-xs font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" />
            </svg>
            {t.watchOnYoutube}
          </a>
        }
      />

      <div className="relative aspect-video overflow-hidden rounded-[28px] rounded-br-none bg-ink">
        {mounted ? (
          <iframe
            ref={iframeRef}
            src={embedUrl(featuredVideo.id)}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : (
          <img
            src={`https://i.ytimg.com/vi/${featuredVideo.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold tracking-tight text-ink md:text-xl">{title}</h3>
        <p className="mt-1 text-sm text-black/55">{featuredVideo.channel}</p>
      </div>
    </section>
  )
}
