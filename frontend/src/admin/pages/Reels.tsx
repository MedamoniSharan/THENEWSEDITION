import { useState } from 'react'
import { Film, Pencil, Plus, Trash2 } from 'lucide-react'
import { mediaUrl } from '../../content/api'
import BilingualField from '../BilingualField'
import { useCollection, useDraft } from '../hooks'
import MediaField from '../media/MediaField'
import { confirmDiscard } from '../router'
import SortableList from '../SortableList'
import { emptyLocalized, type CategoryRecord, type ReelRecord } from '../types'
import { Button, Drawer, EmptyState, Field, IconButton, LoadingBlock, PageHeader, Select } from '../ui'

type ReelDraft = Pick<ReelRecord, 'category' | 'caption' | 'video' | 'poster'> & { id?: string }

function ReelEditor({ reel, categories, onClose }: { reel: ReelDraft; categories: CategoryRecord[]; onClose: () => void }) {
  const { save, remove } = useCollection('reels')
  const { draft, setDraft, dirty } = useDraft(reel)
  if (!draft) return null
  const set = (patch: Partial<ReelDraft>) => setDraft((d) => ({ ...d, ...patch }))
  const close = () => (!dirty || confirmDiscard()) && onClose()

  return (
    <Drawer
      open
      title={draft.id ? 'Edit reel' : 'New reel'}
      onClose={close}
      footer={
        <>
          <Button variant="primary" loading={save.isPending} onClick={() => save.mutate(draft, { onSuccess: onClose })}>
            Save
          </Button>
          <Button onClick={close}>Cancel</Button>
          {draft.id && (
            <Button
              variant="danger"
              className="ml-auto"
              icon={<Trash2 size={15} />}
              loading={remove.isPending}
              onClick={() => window.confirm('Delete this reel?') && remove.mutate(draft.id!, { onSuccess: onClose })}
            >
              Delete
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <MediaField label="Video" kind="video" value={draft.video} onChange={(video) => set({ video })} hint="Short vertical or square clips (10–20 seconds, under 10 MB) load fastest." />
        <MediaField label="Cover image" kind="image" value={draft.poster} onChange={(poster) => set({ poster })} hint="Shown while the video loads." />
        <BilingualField label="Caption" value={draft.caption} onChange={(caption) => set({ caption })} />
        <Field label="Category">
          {(id) => (
            <Select id={id} value={draft.category} onChange={(e) => set({ category: e.target.value })}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name.en} · {c.name.te}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
    </Drawer>
  )
}

export default function Reels() {
  const { items, isPending, reorder } = useCollection('reels')
  const { items: categories } = useCollection('categories')
  const [editing, setEditing] = useState<ReelDraft | null>(null)
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name.en ?? slug

  return (
    <>
      <PageHeader
        title="Reels"
        description="Short videos that play in the dark testimonials section. Drag to change the order; it saves immediately."
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setEditing({ category: categories[0]?.slug ?? '', caption: emptyLocalized(), video: '', poster: '' })}
          >
            New reel
          </Button>
        }
      />

      {isPending ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState title="No reels yet">The reel tiles are hidden until you add one.</EmptyState>
      ) : (
        <SortableList
          items={items}
          getId={(r) => r.id}
          onReorder={(next) => reorder.mutate(next)}
          renderItem={(r) => (
            <div className="flex items-center gap-3">
              {r.poster ? (
                <img src={mediaUrl(r.poster)} alt="" loading="lazy" className="h-14 w-10 shrink-0 rounded-md bg-ink/5 object-cover" />
              ) : (
                <span className="grid h-14 w-10 shrink-0 place-items-center rounded-md bg-ink/10 text-ink/40">
                  <Film size={16} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{r.caption.en || r.caption.te || 'No caption'}</p>
                <p lang="te" className="truncate text-xs text-ink/55">
                  {r.caption.te}
                </p>
                <p className="text-xs text-ink/40">{categoryName(r.category)}</p>
              </div>
              <IconButton label="Edit reel" onClick={() => setEditing(r)}>
                <Pencil size={15} />
              </IconButton>
            </div>
          )}
        />
      )}

      {editing && <ReelEditor key={editing.id ?? 'new'} reel={editing} categories={categories} onClose={() => setEditing(null)} />}
    </>
  )
}
