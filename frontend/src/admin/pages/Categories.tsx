import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import BilingualField from '../BilingualField'
import { useCollection, useDraft, useStats } from '../hooks'
import { confirmDiscard } from '../router'
import SortableList from '../SortableList'
import { emptyLocalized, type CategoryRecord } from '../types'
import { Badge, Button, Drawer, EmptyState, Field, IconButton, Input, LoadingBlock, PageHeader } from '../ui'

type CategoryDraft = Pick<CategoryRecord, 'slug' | 'name' | 'description'> & { id?: string }

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function CategoryEditor({ category, onClose }: { category: CategoryDraft; onClose: () => void }) {
  const { save, remove } = useCollection('categories')
  const { draft, setDraft, dirty } = useDraft(category)
  const [slugTouched, setSlugTouched] = useState(Boolean(category.id))
  if (!draft) return null

  const close = () => (!dirty || confirmDiscard()) && onClose()

  return (
    <Drawer
      open
      title={draft.id ? 'Edit category' : 'New category'}
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
              onClick={() => window.confirm('Delete this category?') && remove.mutate(draft.id!, { onSuccess: onClose })}
            >
              Delete
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <BilingualField
          label="Name"
          required
          value={draft.name}
          onChange={(name) => setDraft((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name.en) }))}
        />
        <BilingualField label="Description" multiline value={draft.description} onChange={(description) => setDraft((d) => ({ ...d, description }))} hint="Shown at the top of the category page." />
        <Field
          label="Web address"
          hint={
            <>
              The page will be at <code>/#/{draft.slug || 'your-category'}</code>. Lowercase letters, numbers and dashes only.
              {draft.id && ' Changing it moves all its articles and reels too.'}
            </>
          }
        >
          {(id) => (
            <Input
              id={id}
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
              }}
              placeholder="political-news"
            />
          )}
        </Field>
      </div>
    </Drawer>
  )
}

export default function Categories() {
  const { items, isPending, reorder } = useCollection('categories')
  const { data: stats } = useStats()
  const [editing, setEditing] = useState<CategoryDraft | null>(null)

  return (
    <>
      <PageHeader
        title="Categories"
        description="The sections in the top menu. Drag to change the menu order; it saves immediately."
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setEditing({ slug: '', name: emptyLocalized(), description: emptyLocalized() })}>
            New category
          </Button>
        }
      />

      {isPending ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <SortableList
          items={items}
          getId={(c) => c.id}
          onReorder={(next) => reorder.mutate(next)}
          renderItem={(c) => (
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">
                  {c.name.en} <span className="font-normal text-ink/40">/</span>{' '}
                  <span lang="te" className="font-medium text-ink/70">
                    {c.name.te || '—'}
                  </span>
                </p>
                <p className="text-xs text-ink/45">/#/{c.slug}</p>
              </div>
              <Badge>{stats?.perCategory[c.slug] ?? 0} articles</Badge>
              <IconButton label={`Edit ${c.name.en}`} onClick={() => setEditing(c)}>
                <Pencil size={15} />
              </IconButton>
            </div>
          )}
        />
      )}

      {editing && <CategoryEditor key={editing.id ?? 'new'} category={editing} onClose={() => setEditing(null)} />}
    </>
  )
}
