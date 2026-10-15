import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import type { YouTubeVideo } from '../../content/types'
import { api } from '../api'
import BilingualField from '../BilingualField'
import { useDraft, useSaveSettings, useSettings } from '../hooks'
import SortableList from '../SortableList'
import { toast } from '../toast'
import { Badge, Button, Card, EmptyState, Field, IconButton, Input, LoadingBlock, PageHeader, SaveBar } from '../ui'

export default function Videos() {
  const { data: settings, isPending } = useSettings()
  const save = useSaveSettings()
  const { draft, setDraft, dirty, reset } = useDraft(settings?.videos)
  const [link, setLink] = useState('')

  const lookup = useMutation({
    mutationFn: (url: string) => api.get<{ youtubeId: string; title: string; channel: string }>(`/admin/youtube?url=${encodeURIComponent(url)}`),
    onSuccess: (video) => {
      if (draft?.some((v) => v.youtubeId === video.youtubeId)) {
        toast.error('That video is already in the list')
        return
      }
      setDraft((list) => [...list, { youtubeId: video.youtubeId, title: { en: video.title, te: '' }, channel: video.channel }])
      setLink('')
    },
  })

  if (isPending || !draft) return <LoadingBlock />

  const add = (e: FormEvent) => {
    e.preventDefault()
    if (link.trim()) lookup.mutate(link.trim())
  }
  const update = (id: string, patch: Partial<YouTubeVideo>) => setDraft((list) => list.map((v) => (v.youtubeId === id ? { ...v, ...patch } : v)))

  return (
    <>
      <PageHeader title="YouTube videos" description="The Videos section on the homepage. The first video plays automatically when visitors scroll to it; the rest appear as thumbnails underneath." />

      <Card className="mb-4">
        <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Field label="Add a YouTube video" hint="Paste any YouTube link: youtube.com/watch?v=…, youtu.be/…, or a Shorts link." className="flex-1">
            {(id) => <Input id={id} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtu.be/…" inputMode="url" />}
          </Field>
          <Button type="submit" variant="primary" icon={<Plus size={16} />} loading={lookup.isPending} className="sm:mb-6">
            Add video
          </Button>
        </form>
      </Card>

      {draft.length === 0 ? (
        <EmptyState title="No videos">The Videos section is hidden until you add one.</EmptyState>
      ) : (
        <SortableList
          items={draft}
          getId={(v) => v.youtubeId}
          onReorder={setDraft}
          renderItem={(v, i) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row">
              <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer" className="relative block shrink-0">
                <img src={`https://i.ytimg.com/vi/${v.youtubeId}/mqdefault.jpg`} alt="" className="aspect-video w-full rounded-lg object-cover sm:w-44" />
                {i === 0 && (
                  <span className="absolute top-2 left-2">
                    <Badge tone="accent">Featured · autoplays</Badge>
                  </span>
                )}
              </a>
              <div className="min-w-0 flex-1 space-y-3">
                <BilingualField label="Title" value={v.title} onChange={(title) => update(v.youtubeId, { title })} />
                <Field label="Channel name">{(id) => <Input id={id} value={v.channel} onChange={(e) => update(v.youtubeId, { channel: e.target.value })} />}</Field>
              </div>
              <IconButton label="Remove video" onClick={() => setDraft((list) => list.filter((x) => x.youtubeId !== v.youtubeId))}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          )}
        />
      )}

      <SaveBar dirty={dirty} saving={save.isPending} onReset={reset} onSave={() => save.mutate({ videos: draft })} />
    </>
  )
}
