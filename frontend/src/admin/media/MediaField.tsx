import { useRef, useState } from 'react'
import { Film, ImageIcon, Images, Trash2, Upload } from 'lucide-react'
import { mediaUrl } from '../../content/api'
import { useMedia } from '../hooks'
import { Button, inputClass, LoadingBlock, Modal, EmptyState } from '../ui'
import Dropzone from './Dropzone'
import MediaGrid from './MediaGrid'
import { acceptFor, filesFromDrop, useUploader } from './upload'
import UploadProgress from './UploadProgress'

interface MediaFieldProps {
  label: string
  kind: 'image' | 'video'
  value: string
  onChange: (url: string) => void
  hint?: string
}

function MediaPicker({ kind, open, value, onClose, onSelect }: { kind: 'image' | 'video'; open: boolean; value: string; onClose: () => void; onSelect: (url: string) => void }) {
  const { data, isPending } = useMedia(kind)
  return (
    <Modal open={open} title={kind === 'image' ? 'Choose an image' : 'Choose a video'} onClose={onClose}>
      <Dropzone kind={kind} multiple={false} onUploaded={(asset) => onSelect(asset.url)}>
        Drop a new {kind} here, or click to upload
      </Dropzone>
      <div className="mt-6">
        {isPending ? (
          <LoadingBlock />
        ) : data?.length ? (
          <MediaGrid assets={data} selectedUrl={value} onSelect={(asset) => onSelect(asset.url)} />
        ) : (
          <EmptyState title={`No ${kind}s uploaded yet`} />
        )}
      </div>
    </Modal>
  )
}

/**
 * Picks an image or video: drop a file on the preview, upload from the computer,
 * choose from the media library, or paste a link.
 */
export default function MediaField({ label, kind, value, onChange, hint }: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [picking, setPicking] = useState(false)
  const { uploads, upload, busy } = useUploader(kind, (asset) => onChange(asset.url))
  const Icon = kind === 'image' ? ImageIcon : Film
  const src = value ? mediaUrl(value) : ''

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          onDragEnter={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            void upload(filesFromDrop(e).slice(0, 1))
          }}
          className={`relative grid aspect-video w-full shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-dashed sm:w-56 ${
            over ? 'border-accent bg-accent/5' : value ? 'border-transparent bg-ink/5' : 'border-ink/15 bg-white'
          }`}
        >
          {src ? (
            kind === 'image' ? (
              <img src={value.startsWith('/media/') ? `${src}?w=480` : src} alt="" className="size-full object-cover" />
            ) : (
              <video src={src} muted playsInline preload="metadata" controls className="size-full bg-black object-contain" />
            )
          ) : (
            <button type="button" onClick={() => inputRef.current?.click()} className="flex flex-col items-center gap-1.5 p-3 text-center text-xs text-ink/50">
              <Icon size={22} />
              Drop {kind === 'image' ? 'an image' : 'a video'} here
            </button>
          )}
          {over && <div className="absolute inset-0 grid place-items-center bg-accent/10 text-sm font-semibold text-accent">Drop to upload</div>}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" icon={<Upload size={14} />} onClick={() => inputRef.current?.click()} loading={busy}>
              Upload
            </Button>
            <Button size="sm" icon={<Images size={14} />} onClick={() => setPicking(true)}>
              Media library
            </Button>
            {value && (
              <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} onClick={() => onChange('')}>
                Remove
              </Button>
            )}
          </div>
          <input
            type="text"
            inputMode="url"
            value={value}
            onChange={(e) => onChange(e.target.value.trim())}
            placeholder={`…or paste ${kind === 'image' ? 'an image' : 'a video'} link (https://…)`}
            aria-label={`${label} link`}
            className={inputClass}
          />
          {hint && <p className="text-xs text-ink/50">{hint}</p>}
          <UploadProgress uploads={uploads} />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={acceptFor(kind)}
        onChange={(e) => {
          void upload(Array.from(e.target.files ?? []).slice(0, 1))
          e.target.value = ''
        }}
      />
      <MediaPicker
        kind={kind}
        open={picking}
        value={value}
        onClose={() => setPicking(false)}
        onSelect={(url) => {
          onChange(url)
          setPicking(false)
        }}
      />
    </div>
  )
}
