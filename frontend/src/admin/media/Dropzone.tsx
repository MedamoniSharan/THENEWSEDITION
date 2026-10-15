import { useRef, useState, type ReactNode } from 'react'
import { CloudUpload } from 'lucide-react'
import { MAX_UPLOAD_MB } from '../api'
import type { Asset } from '../types'
import { acceptFor, filesFromDrop, useUploader, type MediaKind } from './upload'
import UploadProgress from './UploadProgress'

interface DropzoneProps {
  kind?: MediaKind
  multiple?: boolean
  onUploaded?: (asset: Asset) => void
  children?: ReactNode
}

/** Large drop target: drag files from the computer onto it, or click to browse. */
export default function Dropzone({ kind = 'any', multiple = true, onUploaded = () => {}, children }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const { uploads, upload } = useUploader(kind, onUploaded)

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          const files = filesFromDrop(e)
          void upload(multiple ? files : files.slice(0, 1))
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          over ? 'border-accent bg-accent/5' : 'border-ink/15 bg-white hover:border-ink/30'
        }`}
      >
        <CloudUpload size={32} className={over ? 'text-accent' : 'text-ink/35'} />
        <p className="mt-3 text-sm font-semibold text-ink">{children ?? 'Drag and drop files here, or click to browse'}</p>
        <p className="mt-1 text-xs text-ink/50">
          {kind === 'video' ? 'MP4, WebM or MOV' : kind === 'image' ? 'JPG, PNG, WebP, AVIF or GIF' : 'Images (JPG, PNG, WebP, AVIF, GIF) or videos (MP4, WebM, MOV)'} · up to {MAX_UPLOAD_MB} MB.
          {kind !== 'video' && ' Images are resized and converted to WebP automatically.'}
        </p>
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={acceptFor(kind)}
          onChange={(e) => {
            void upload(Array.from(e.target.files ?? []))
            e.target.value = ''
          }}
        />
      </div>
      <UploadProgress uploads={uploads} />
    </div>
  )
}
