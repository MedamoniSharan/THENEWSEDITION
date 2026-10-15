import { useMemo, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { responsiveImage } from '../../content/api'
import BilingualField from '../BilingualField'
import { useCollection, useDraft } from '../hooks'
import MediaField from '../media/MediaField'
import { confirmDiscard } from '../router'
import { emptyLocalized, type ArticleRecord, type CategoryRecord } from '../types'
import { Badge, Button, Drawer, EmptyState, Field, Input, LoadingBlock, PageHeader, Select, Toggle } from '../ui'

type ArticleDraft = Omit<ArticleRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }

const today = () => new Date().toISOString().slice(0, 10)

const newArticle = (category = ''): ArticleDraft => ({
  title: emptyLocalized(),
  excerpt: emptyLocalized(),
  image: '',
  category,
  author: { name: emptyLocalized() },
  date: today(),
  published: true,
})

export function ArticleThumb({ src, className = 'h-12 w-16' }: { src: string; className?: string }) {
  return src ? (
    <img src={responsiveImage(src, 480).src} alt="" loading="lazy" className={`${className} shrink-0 rounded-lg bg-ink/5 object-cover`} />
  ) : (
    <span className={`${className} shrink-0 rounded-lg bg-ink/10`} />
  )
}

function ArticleEditor({ article, categories, onClose }: { article: ArticleDraft; categories: CategoryRecord[]; onClose: () => void }) {
  const { save, remove } = useCollection('articles')
  const { draft, setDraft, dirty } = useDraft(article)
  if (!draft) return null
  const set = (patch: Partial<ArticleDraft>) => setDraft((d) => ({ ...d, ...patch }))

  const close = () => (!dirty || confirmDiscard()) && onClose()
  const submit = () => save.mutate(draft, { onSuccess: onClose })

  return (
    <Drawer
      open
      title={draft.id ? 'Edit article' : 'New article'}
      onClose={close}
      footer={
        <>
          <Button variant="primary" onClick={submit} loading={save.isPending} disabled={!draft.id && !dirty}>
            {draft.id ? 'Save changes' : 'Publish article'}
          </Button>
          <Button onClick={close}>Cancel</Button>
          {draft.id && (
            <Button
              variant="danger"
              className="ml-auto"
              icon={<Trash2 size={15} />}
              loading={remove.isPending}
              onClick={() => window.confirm('Delete this article? It will be removed from the website.') && remove.mutate(draft.id!, { onSuccess: onClose })}
            >
              Delete
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <BilingualField label="Headline" required value={draft.title} onChange={(title) => set({ title })} multiline rows={2} />
        <BilingualField label="Summary" value={draft.excerpt} onChange={(excerpt) => set({ excerpt })} multiline rows={4} hint="Shown under the headline on cards and category pages." />
        <MediaField label="Photo" kind="image" value={draft.image} onChange={(image) => set({ image })} hint="Landscape photos at least 1600 px wide look best." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            {(id) => (
              <Select id={id} value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name.en} · {c.name.te}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Date">{(id) => <Input id={id} type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} />}</Field>
        </div>
        <BilingualField label="Author name" value={draft.author.name} onChange={(name) => set({ author: { name } })} />
        <Toggle checked={draft.published} onChange={(published) => set({ published })} label={draft.published ? 'Published (visible on the website)' : 'Draft (hidden from the website)'} />
      </div>
    </Drawer>
  )
}

export default function Articles() {
  const { items, isPending } = useCollection('articles')
  const { items: categories } = useCollection('categories')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<'all' | 'published' | 'draft' | 'missing-te'>('all')
  const [editing, setEditing] = useState<ArticleDraft | null>(null)

  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name.en ?? slug

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (a) =>
        (!category || a.category === category) &&
        (status === 'all' ||
          (status === 'published' && a.published) ||
          (status === 'draft' && !a.published) ||
          (status === 'missing-te' && (!a.title.te || !a.excerpt.te))) &&
        (!q || `${a.title.en} ${a.title.te} ${a.excerpt.en} ${a.excerpt.te} ${a.author.name.en}`.toLowerCase().includes(q)),
    )
  }, [items, query, category, status])

  return (
    <>
      <PageHeader
        title="Articles"
        description="Every story on the website. Click a story to edit it in English and Telugu."
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setEditing(newArticle(category || categories[0]?.slug))}>
            New article
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search headlines in English or Telugu" className="pl-9" aria-label="Search articles" />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-48" aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name.en}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="sm:w-48" aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="missing-te">Missing Telugu</option>
        </Select>
      </div>

      {isPending ? (
        <LoadingBlock />
      ) : filtered.length === 0 ? (
        <EmptyState title={items.length ? 'No articles match your filters' : 'No articles yet'}>
          {!items.length && 'Click “New article” to write the first one.'}
        </EmptyState>
      ) : (
        <ul className="divide-y divide-ink/5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          {filtered.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => setEditing(a)} className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-paper">
                <ArticleThumb src={a.image} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{a.title.en || a.title.te}</p>
                  {a.title.te && a.title.en ? (
                    <p lang="te" className="truncate text-sm text-ink/55">
                      {a.title.te}
                    </p>
                  ) : (
                    <Badge tone="warning">{a.title.en ? 'Telugu missing' : 'English missing'}</Badge>
                  )}
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <span className="text-xs font-medium text-ink/60">{categoryName(a.category)}</span>
                  <span className="text-xs text-ink/40">{a.date}</span>
                </div>
                <Badge tone={a.published ? 'success' : 'neutral'}>{a.published ? 'Published' : 'Draft'}</Badge>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-ink/40">
        Showing {filtered.length} of {items.length} articles
      </p>

      {editing && <ArticleEditor key={editing.id ?? 'new'} article={editing} categories={categories} onClose={() => setEditing(null)} />}
    </>
  )
}
