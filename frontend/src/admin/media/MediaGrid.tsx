import type { ReactNode } from 'react'
import { Check, Film } from 'lucide-react'
import { mediaUrl } from '../../content/api'
import type { Asset } from '../types'

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

interface MediaGridProps {
  assets: Asset[]
  selectedUrl?: string
  onSelect?: (asset: Asset) => void
  renderActions?: (asset: Asset) => ReactNode
}

export default function MediaGrid({ assets, selectedUrl, onSelect, renderActions }: MediaGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => {
        const selected = asset.url === selectedUrl
        const preview =
          asset.kind === 'image' ? (
            <img src={`${mediaUrl(asset.url)}?w=480`} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <span className="relative block size-full">
              <video src={mediaUrl(asset.url)} preload="metadata" muted className="size-full object-cover" />
              <Film size={18} className="absolute top-2 left-2 text-white drop-shadow" />
            </span>
          )
        return (
          <li key={asset.id} className={`overflow-hidden rounded-xl bg-white ring-1 ${selected ? 'ring-2 ring-accent' : 'ring-ink/10'}`}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(asset)} className="relative block aspect-video w-full bg-ink/5" aria-label={`Use ${asset.filename}`}>
                {preview}
                {selected && (
                  <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-accent text-white">
                    <Check size={14} />
                  </span>
                )}
              </button>
            ) : (
              <div className="aspect-video bg-ink/5">{preview}</div>
            )}
            <div className="flex items-center gap-2 p-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink" title={asset.filename}>
                  {asset.filename}
                </p>
                <p className="text-[11px] text-ink/45">
                  {formatBytes(asset.size)}
                  {asset.width ? ` · ${asset.width}×${asset.height}` : ''}
                </p>
              </div>
              {renderActions?.(asset)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
