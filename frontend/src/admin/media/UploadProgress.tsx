import type { Upload } from './upload'

export default function UploadProgress({ uploads }: { uploads: Upload[] }) {
  if (!uploads.length) return null
  return (
    <ul className="mt-3 space-y-2">
      {uploads.map((u) => (
        <li key={u.id} className="text-xs text-ink/70">
          <div className="flex justify-between gap-3">
            <span className="truncate">{u.name}</span>
            <span>{u.progress < 1 ? `${Math.round(u.progress * 100)}%` : 'Optimising…'}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full bg-accent transition-[width]" style={{ width: `${u.progress * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
