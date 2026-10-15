import { useState, type DragEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { uploadFile } from '../api'
import { toast } from '../toast'
import type { Asset } from '../types'

export type MediaKind = 'image' | 'video' | 'any'

export interface Upload {
  id: number
  name: string
  progress: number
}

export const acceptFor = (kind: MediaKind) =>
  kind === 'image'
    ? 'image/jpeg,image/png,image/webp,image/avif,image/gif'
    : kind === 'video'
      ? 'video/mp4,video/webm,video/quicktime'
      : 'image/*,video/mp4,video/webm,video/quicktime'

const matchesKind = (file: File, kind: MediaKind) =>
  kind === 'any' ? /^(image|video)\//.test(file.type) : file.type.startsWith(`${kind}/`)

export const filesFromDrop = (e: DragEvent) => Array.from(e.dataTransfer.files)

let uploadId = 0

/** Uploads files and tracks their progress; shared by the dropzone and the media field. */
export function useUploader(kind: MediaKind, onUploaded: (asset: Asset) => void) {
  const qc = useQueryClient()
  const [uploads, setUploads] = useState<Upload[]>([])

  const upload = async (files: File[]) => {
    const accepted = files.filter((f) => matchesKind(f, kind))
    if (accepted.length < files.length) {
      toast.error(
        kind === 'image' ? 'Only images can be used here' : kind === 'video' ? 'Only videos can be used here' : 'Only images and videos can be uploaded',
      )
    }
    for (const file of accepted) {
      const id = ++uploadId
      setUploads((u) => [...u, { id, name: file.name, progress: 0 }])
      try {
        const asset = await uploadFile(file, (progress) => setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x))))
        onUploaded(asset)
      } catch (err) {
        toast.error((err as Error).message)
      } finally {
        setUploads((u) => u.filter((x) => x.id !== id))
      }
    }
    void qc.invalidateQueries({ queryKey: ['media'] })
    void qc.invalidateQueries({ queryKey: ['stats'] })
  }

  return { uploads, upload, busy: uploads.length > 0 }
}
