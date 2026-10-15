/** Empty when the API is served from the same domain (the default, and the dev proxy). */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export const apiUrl = (path: string) => `${API_BASE}${path}`

/** Uploaded files are served by the API; everything else (site paths, external links) is used as is. */
export const mediaUrl = (src: string) => (src.startsWith('/media/') ? `${API_BASE}${src}` : src)

const MEDIA_WIDTHS = [480, 960, 1600]
const UNSPLASH_WIDTHS = [400, 800, 1200, 1600]

/** Responsive `src`/`srcSet` for uploaded images and Unsplash links, so phones download smaller files. */
export function responsiveImage(src: string, width = 960): { src: string; srcSet?: string } {
  if (src.startsWith('/media/')) {
    const url = mediaUrl(src)
    return { src: `${url}?w=${width}`, srcSet: MEDIA_WIDTHS.map((w) => `${url}?w=${w} ${w}w`).join(', ') }
  }
  if (src.startsWith('https://images.unsplash.com/')) {
    const url = new URL(src)
    const at = (w: number) => {
      url.searchParams.set('w', String(w))
      return url.toString()
    }
    return { src: at(width), srcSet: UNSPLASH_WIDTHS.map((w) => `${at(w)} ${w}w`).join(', ') }
  }
  return { src }
}

export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
