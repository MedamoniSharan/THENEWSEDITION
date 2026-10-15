import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiUrl } from './api'
import { ContentContext, type ContentState } from './context'
import type { SiteContent } from './types'

const CACHE_KEY = 'tne-content-v1'

function readCache(): { content: SiteContent; raw: string } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? { content: JSON.parse(raw) as SiteContent, raw } : null
  } catch {
    return null
  }
}

/**
 * Returning visitors render instantly from the copy saved on their last visit while the latest
 * content loads in the background (stale-while-revalidate); the server answers 304 when nothing changed.
 */
export default function ContentProvider({ children }: { children: ReactNode }) {
  const [cached] = useState(readCache)
  const [content, setContent] = useState<SiteContent | null>(cached?.content ?? null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch(apiUrl('/api/content'))
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(String(res.status)))))
      .then((raw) => {
        if (cancelled) return
        setFailed(false)
        if (raw === cached?.raw) return
        setContent(JSON.parse(raw) as SiteContent)
        try {
          localStorage.setItem(CACHE_KEY, raw)
        } catch {
          // Storage full or blocked: the site still works, it just can't start instantly next time.
        }
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [attempt, cached])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  const value = useMemo<ContentState>(() => ({ content, failed, retry }), [content, failed, retry])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
