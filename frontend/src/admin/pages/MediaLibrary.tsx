import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Copy, Trash2 } from 'lucide-react'
import { mediaUrl } from '../../content/api'
import { api } from '../api'
import { useMedia } from '../hooks'
import Dropzone from '../media/Dropzone'
import MediaGrid from '../media/MediaGrid'
import { toast } from '../toast'
import { EmptyState, IconButton, LoadingBlock, PageHeader } from '../ui'

const filters = [
  { value: undefined, label: 'All' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
] as const

export default function MediaLibrary() {
  const qc = useQueryClient()
  const [kind, setKind] = useState<'image' | 'video' | undefined>()
  const { data, isPending } = useMedia(kind)

  const remove = useMutation({
    mutationFn: (id: string) => api.del(`/admin/media/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['media'] })
      void qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('File deleted')
    },
  })

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(new URL(mediaUrl(url), window.location.origin).toString())
    toast.success('Link copied')
  }

  return (
    <>
      <PageHeader title="Media library" description="All uploaded images and videos. Drag several files at once onto the box below to upload them." />

      <Dropzone />

      <div className="mt-8 mb-4 flex gap-1 rounded-lg bg-white p-1 shadow-sm ring-1 ring-ink/5 sm:w-fit">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setKind(f.value)}
            aria-pressed={kind === f.value}
            className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium sm:flex-none ${kind === f.value ? 'bg-ink text-white' : 'text-ink/60 hover:text-ink'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isPending ? (
        <LoadingBlock />
      ) : !data?.length ? (
        <EmptyState title="Nothing uploaded yet" />
      ) : (
        <MediaGrid
          assets={data}
          renderActions={(asset) => (
            <>
              <IconButton label="Copy link" onClick={() => void copy(asset.url)}>
                <Copy size={14} />
              </IconButton>
              <IconButton
                label="Delete file"
                onClick={() =>
                  window.confirm(`Delete ${asset.filename}? Anything on the website still using it will show a broken ${asset.kind}.`) &&
                  remove.mutate(asset.id)
                }
              >
                <Trash2 size={14} />
              </IconButton>
            </>
          )}
        />
      )}
    </>
  )
}
