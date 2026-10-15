import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import BilingualField from '../BilingualField'
import { useCollection, useDraft } from '../hooks'
import { confirmDiscard } from '../router'
import SortableList from '../SortableList'
import { emptyLocalized, type QuoteRecord } from '../types'
import { Button, Drawer, EmptyState, IconButton, LoadingBlock, PageHeader } from '../ui'

type QuoteDraft = Pick<QuoteRecord, 'name' | 'role' | 'paragraphs'> & { id?: string }

function QuoteEditor({ quote, onClose }: { quote: QuoteDraft; onClose: () => void }) {
  const { save, remove } = useCollection('quotes')
  const { draft, setDraft, dirty } = useDraft(quote)
  if (!draft) return null
  const close = () => (!dirty || confirmDiscard()) && onClose()
  const setParagraphs = (paragraphs: QuoteDraft['paragraphs']) => setDraft((d) => ({ ...d, paragraphs }))

  return (
    <Drawer
      open
      title={draft.id ? 'Edit testimonial' : 'New testimonial'}
      onClose={close}
      footer={
        <>
          <Button
            variant="primary"
            loading={save.isPending}
            onClick={() => save.mutate({ ...draft, paragraphs: draft.paragraphs.filter((p) => p.en.trim() || p.te.trim()) }, { onSuccess: onClose })}
          >
            Save
          </Button>
          <Button onClick={close}>Cancel</Button>
          {draft.id && (
            <Button
              variant="danger"
              className="ml-auto"
              icon={<Trash2 size={15} />}
              loading={remove.isPending}
              onClick={() => window.confirm('Delete this testimonial?') && remove.mutate(draft.id!, { onSuccess: onClose })}
            >
              Delete
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <BilingualField label="Reader’s name" required value={draft.name} onChange={(name) => setDraft((d) => ({ ...d, name }))} />
        <BilingualField label="Job and city" value={draft.role} onChange={(role) => setDraft((d) => ({ ...d, role }))} placeholder={{ en: 'Teacher, Hyderabad', te: 'ఉపాధ్యాయురాలు, హైదరాబాద్' }} />
        {draft.paragraphs.map((p, i) => (
          <div key={i} className="relative">
            <BilingualField
              label={`Paragraph ${i + 1}`}
              multiline
              value={p}
              onChange={(value) => setParagraphs(draft.paragraphs.map((x, j) => (j === i ? value : x)))}
            />
            <IconButton label={`Delete paragraph ${i + 1}`} className="absolute -top-1 right-0" onClick={() => setParagraphs(draft.paragraphs.filter((_, j) => j !== i))}>
              <Trash2 size={15} />
            </IconButton>
          </div>
        ))}
        {draft.paragraphs.length < 6 && (
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setParagraphs([...draft.paragraphs, emptyLocalized()])}>
            Add paragraph
          </Button>
        )}
      </div>
    </Drawer>
  )
}

export default function Testimonials() {
  const { items, isPending, reorder } = useCollection('quotes')
  const [editing, setEditing] = useState<QuoteDraft | null>(null)

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Reader quotes shown between the reels. Drag to change the order; it saves immediately."
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setEditing({ name: emptyLocalized(), role: emptyLocalized(), paragraphs: [emptyLocalized()] })}>
            New testimonial
          </Button>
        }
      />

      {isPending ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState title="No testimonials yet" />
      ) : (
        <SortableList
          items={items}
          getId={(q) => q.id}
          onReorder={(next) => reorder.mutate(next)}
          renderItem={(q) => (
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">
                  {q.name.en} {q.role.en && <span className="font-normal text-ink/50">({q.role.en})</span>}
                </p>
                <p className="truncate text-xs text-ink/55">{q.paragraphs[0]?.en}</p>
              </div>
              <IconButton label="Edit testimonial" onClick={() => setEditing(q)}>
                <Pencil size={15} />
              </IconButton>
            </div>
          )}
        />
      )}

      {editing && <QuoteEditor key={editing.id ?? 'new'} quote={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
