import { HttpError } from './http.ts'

/** Accepts watch, youtu.be, shorts, embed and live links, or a bare 11-character id. */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim()
  if (/^[\w-]{11}$/.test(value)) return value
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '')
    if (host === 'youtu.be') return url.pathname.slice(1, 12) || null
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = url.searchParams.get('v')
      if (v) return v.slice(0, 11)
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)
      return match?.[1] ?? null
    }
  } catch {
    return null
  }
  return null
}

export async function lookupYouTube(input: string) {
  const youtubeId = parseYouTubeId(input)
  if (!youtubeId) throw new HttpError(400, 'That is not a YouTube video link')

  const res = await fetch(
    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${youtubeId}`)}`,
    { signal: AbortSignal.timeout(8000) },
  ).catch(() => null)
  if (!res?.ok) {
    if (res && [400, 401, 403, 404].includes(res.status)) {
      throw new HttpError(404, 'YouTube could not find that video, or it does not allow embedding')
    }
    return { youtubeId, title: '', channel: '' }
  }
  const data = (await res.json()) as { title?: string; author_name?: string }
  return { youtubeId, title: data.title ?? '', channel: data.author_name ?? '' }
}
