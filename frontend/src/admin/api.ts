import { apiUrl } from '../content/api'
import type { Asset } from './types'

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(apiUrl(`/api${path}`), {
      method,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection.')
  }
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? `Request failed (${res.status})`)
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  del: (path: string) => request<void>('DELETE', path),
}

export const MAX_UPLOAD_MB = 100

/** Uses XHR rather than fetch because only XHR reports upload progress. */
export function uploadFile(file: File, onProgress: (fraction: number) => void): Promise<Asset> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      reject(new ApiError(413, `${file.name} is larger than ${MAX_UPLOAD_MB} MB`))
      return
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', apiUrl('/api/admin/media'))
    xhr.withCredentials = true
    xhr.responseType = 'json'
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total)
    xhr.onload = () => {
      const data = xhr.response as (Asset & { error?: string }) | null
      if (xhr.status >= 200 && xhr.status < 300 && data) resolve(data)
      else reject(new ApiError(xhr.status, data?.error ?? `Upload failed (${xhr.status})`))
    }
    xhr.onerror = () => reject(new ApiError(0, 'Upload failed. Check your connection.'))
    const form = new FormData()
    form.append('file', file)
    xhr.send(form)
  })
}
