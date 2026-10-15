import { createContext, useContext } from 'react'
import type { Article, Category, SiteContent } from './types'

export interface ContentState {
  content: SiteContent | null
  failed: boolean
  retry: () => void
}

export const ContentContext = createContext<ContentState | null>(null)

export function useContentState() {
  const value = useContext(ContentContext)
  if (!value) throw new Error('useContentState must be used inside <ContentProvider>')
  return value
}

/** For components that only render once content has loaded. */
export function useContent(): SiteContent {
  const { content } = useContentState()
  if (!content) throw new Error('useContent was called before the site content loaded')
  return content
}

export function useHomepageArticles(ids: string[]): Article[] {
  const { articles } = useContent()
  return ids.map((id) => articles[id]).filter(Boolean)
}

export function useHomepageArticle(id: string | null): Article | undefined {
  const { articles } = useContent()
  return id ? articles[id] : undefined
}

export function useCategory(slug: string | undefined): Category | undefined {
  const { categories } = useContent()
  return slug ? categories.find((c) => c.slug === slug) : undefined
}
