import { useCallback, useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { useContent } from '../content/context'
import type { YouTubeVideo } from '../content/types'
import { useLanguage } from '../i18n/language'
import SectionHeader from './ui/SectionHeader'

const YT_ORIGIN = 'https://www.youtube.com'
const GESTURE_EVENTS = ['pointerup', 'keydown', 'touchend'] as const
const PLAYING = 1
const UNMUTE_CHECK_MS = 800

const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`
const thumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

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

/** One embedded video; remounted (via `key`) whenever the visitor picks another video. */
function Player({ video, inView, title }: { video: YouTubeVideo; inView: boolean; title: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerState = useRef<number | null>(null)
  const [ready, setReady] = useState(false)

  const send = useCallback((message: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(message), YT_ORIGIN)
  }, [])
  const command = useCallback((func: string) => send({ event: 'command', func, args: [] }), [send])

  useEffect(() => {
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
  }, [])

  // The player only reports back once the page announces it is listening.
  useEffect(() => {
    if (ready) return
    const id = window.setInterval(() => send({ event: 'listening', id: 'tne-youtube', channel: 'widget' }), 250)
    return () => window.clearInterval(id)
  }, [ready, send])

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
    <iframe
      ref={iframeRef}
      src={embedUrl(video.youtubeId)}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="absolute inset-0 size-full"
    />
  )
}

export default function YouTubeSection() {
  const { t, tr } = useLanguage()
  const { videos } = useContent()
  const sectionRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = videos.find((v) => v.youtubeId === activeId) ?? videos[0]
  const hasVideo = Boolean(active)

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
  }, [hasVideo])

  if (!active) return null
  const title = tr(active.title)

  return (
    <section ref={sectionRef} id="videos" className="scroll-mt-6 py-14 md:py-20">
      <SectionHeader
        title={t.videos}
        action={
          <a
            href={watchUrl(active.youtubeId)}
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
          <Player key={active.youtubeId} video={active} inView={inView} title={title} />
        ) : (
          <img
            src={thumbnail(active.youtubeId)}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold tracking-tight text-ink md:text-xl">{title}</h3>
        {active.channel && <p className="mt-1 text-sm text-black/55">{active.channel}</p>}
      </div>

      {videos.length > 1 && (
        <ul className="no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-1">
          {videos.map((video) => {
            const isActive = video.youtubeId === active.youtubeId
            return (
              <li key={video.youtubeId} className="w-56 shrink-0 sm:w-64">
                <button
                  type="button"
                  onClick={() => setActiveId(video.youtubeId)}
                  aria-current={isActive || undefined}
                  aria-label={`${t.playVideo}: ${tr(video.title)}`}
                  className="group w-full text-left"
                >
                  <span
                    className={`relative block aspect-video overflow-hidden rounded-2xl ring-2 transition ${
                      isActive ? 'ring-accent' : 'ring-transparent'
                    }`}
                  >
                    <img
                      src={thumbnail(video.youtubeId)}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-black/20">
                      <span className="grid size-10 place-items-center rounded-full bg-accent text-white">
                        <Play size={16} className="ml-0.5 fill-current" />
                      </span>
                    </span>
                  </span>
                  <span className="mt-2 line-clamp-2 block text-sm font-semibold text-ink">{tr(video.title)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
