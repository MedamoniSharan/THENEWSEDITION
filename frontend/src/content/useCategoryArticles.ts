import { useEffect, useState } from 'react'
import { getJson } from './api'
import type { Article, CategoryArticlesPage } from './types'

/** Pages already loaded this visit, so going back to a category is instant. */
const cache = new Map<string, CategoryArticlesPage[]>()
const inflight = new Map<string, Promise<CategoryArticlesPage>>()

function fetchPage(slug: string, page: number) {
  const key = `${slug}:${page}`
  let request = inflight.get(key)
  if (!request) {
    request = getJson<CategoryArticlesPage>(`/api/categories/${encodeURIComponent(slug)}/articles?page=${page}`)
    inflight.set(key, request)
    void request.finally(() => inflight.delete(key)).catch(() => undefined)
  }
  return request
}

/** Starts loading a category before the visitor clicks it (on hover or focus). */
export function prefetchCategory(slug: string) {
  if (!cache.has(slug)) {
    fetchPage(slug, 1)
      .then((page) => !cache.has(slug) && cache.set(slug, [page]))
      .catch(() => undefined)
  }
}

/** Shows cached stories immediately and always refreshes the first page in the background. */
export function useCategoryArticles(slug: string) {
  const [pages, setPages] = useState(() => cache.get(slug)?.slice(0, 1) ?? [])
  const [requested, setRequested] = useState(1)
  const [failedPage, setFailedPage] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchPage(slug, requested)
      .then((data) => {
        if (cancelled) return
        const next = [...(cache.get(slug) ?? []).slice(0, requested - 1), data]
        cache.set(slug, next)
        setPages(next)
        setFailedPage(null)
      })
      .catch(() => !cancelled && setFailedPage(requested))
    return () => {
      cancelled = true
    }
  }, [slug, requested, attempt])

  const articles: Article[] = pages.flatMap((p) => p.articles)
  const last = pages.at(-1)
  return {
    articles,
    total: last?.total ?? 0,
    ready: pages.length > 0,
    loading: pages.length < requested && failedPage !== requested,
    failed: failedPage !== null,
    hasMore: last ? last.page * last.pageSize < last.total : false,
    loadMore: () => (failedPage ? setAttempt((n) => n + 1) : setRequested(pages.length + 1)),
    retry: () => setAttempt((n) => n + 1),
  }
}
