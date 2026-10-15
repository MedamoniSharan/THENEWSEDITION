import { useEffect, useState } from 'react'
import type { Article } from '../content/types'

/** Category routes use `#/<slug>`; any other hash (e.g. `#latest`) is a homepage anchor. */
export const categoryHref = (slug: string) => `#/${slug}`
export const homeHref = '#/'
/** There are no article pages yet, so stories open their category. */
export const articleHref = (article: Article) => categoryHref(article.category)

interface Route {
  slug?: string
  anchor?: string
}

const parse = (): Route => {
  const { hash } = window.location
  const match = hash.match(/^#\/([\w-]+)/)
  if (match) return { slug: match[1] }
  return { anchor: hash.length > 1 && !hash.startsWith('#/') ? hash.slice(1) : undefined }
}

/** Returns the slug of the category being viewed, or undefined on the homepage. */
export function useCategoryRoute() {
  const [route, setRoute] = useState(parse)
  const [navCount, setNavCount] = useState(0)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parse())
      setNavCount((n) => n + 1)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (navCount === 0) return
    const target = route.anchor ? document.getElementById(route.anchor) : null
    if (target) target.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navCount, route])

  return route.slug
}
