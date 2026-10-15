import { useSyncExternalStore } from 'react'
import { CircleAlert, CircleCheck, X } from 'lucide-react'
import { dismiss, getToasts, subscribe } from './toast'

export default function Toaster() {
  const items = useSyncExternalStore(subscribe, getToasts)

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className="pointer-events-auto flex items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg"
        >
          {t.kind === 'success' ? (
            <CircleCheck size={18} className="mt-px shrink-0 text-emerald-400" />
          ) : (
            <CircleAlert size={18} className="mt-px shrink-0 text-red-400" />
          )}
          <p className="flex-1">{t.message}</p>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
