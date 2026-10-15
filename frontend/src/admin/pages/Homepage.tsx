import { ExternalLink, X } from 'lucide-react'
import type { Homepage as HomepageLayout } from '../../content/types'
import ArticlePicker from '../ArticlePicker'
import { useCollection, useDraft, useSaveSettings, useSettings } from '../hooks'
import SortableList from '../SortableList'
import type { ArticleRecord } from '../types'
import { Badge, Button, Card, IconButton, LoadingBlock, PageHeader, SaveBar } from '../ui'
import { ArticleThumb } from './Articles'

type SingleKey = 'hero' | 'popularFeature' | 'highlightFeature'
type ListKey = 'side' | 'latest' | 'popular' | 'highlight'

type Section =
  | { key: SingleKey; title: string; description: string; single: true }
  | { key: ListKey; title: string; description: string; single?: false; max: number }

const sections: Section[] = [
  { key: 'hero', single: true, title: 'Top story', description: 'The big story at the very top of the homepage.' },
  { key: 'side', max: 3, title: 'Beside the top story', description: 'Up to 3 smaller stories next to the top story.' },
  { key: 'latest', max: 30, title: 'Latest News carousel', description: 'Scrolls sideways automatically. 4 to 10 stories work best.' },
  { key: 'popularFeature', single: true, title: 'Popular Story: main story', description: 'The large story in the dark Popular Story section.' },
  { key: 'popular', max: 6, title: 'Popular Story: more stories', description: 'Shown in rows of 3 under the main popular story.' },
  { key: 'highlightFeature', single: true, title: 'Highlight: main story', description: 'The wide story card in the Highlight section.' },
  { key: 'highlight', max: 8, title: 'Highlight: more stories', description: 'Shown in rows of 4 under the main highlight.' },
]

function StoryRow({ article, onRemove }: { article?: ArticleRecord; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <ArticleThumb src={article?.image ?? ''} className="h-10 w-14" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{article ? article.title.en || article.title.te : 'Deleted article'}</p>
        {article?.title.te && article.title.en && (
          <p lang="te" className="truncate text-xs text-ink/50">
            {article.title.te}
          </p>
        )}
      </div>
      {article && !article.published && <Badge tone="warning">Draft: hidden</Badge>}
      <IconButton label="Remove from this section" onClick={onRemove}>
        <X size={16} />
      </IconButton>
    </div>
  )
}

export default function Homepage() {
  const { data: settings, isPending } = useSettings()
  const { items: articles, isPending: articlesPending } = useCollection('articles')
  const saveSettings = useSaveSettings()
  const { draft, setDraft, dirty, reset } = useDraft(settings?.homepage)

  if (isPending || articlesPending || !draft) return <LoadingBlock />

  const byId = new Map(articles.map((a) => [a.id, a]))
  const set = (patch: Partial<HomepageLayout>) => setDraft((d) => ({ ...d, ...patch }))

  return (
    <>
      <PageHeader
        title="Homepage layout"
        description="Choose which stories appear in each homepage section. Drag the handle to change the order."
        actions={
          <a href="/" target="_blank" rel="noreferrer">
            <Button icon={<ExternalLink size={15} />}>Preview website</Button>
          </a>
        }
      />

      <div className="space-y-4">
        {sections.map((section) => {
          if (section.single) {
            const id = draft[section.key]
            return (
              <Card key={section.key} title={section.title} description={section.description}>
                {id ? (
                  <div className="rounded-xl px-3 py-2 ring-1 ring-ink/10">
                    <StoryRow article={byId.get(id)} onRemove={() => set({ [section.key]: null })} />
                  </div>
                ) : (
                  <ArticlePicker articles={articles} exclude={[]} onPick={(a) => set({ [section.key]: a.id })} placeholder="Search a story for this spot…" />
                )}
              </Card>
            )
          }

          const ids = draft[section.key]
          const full = ids.length >= section.max
          return (
            <Card
              key={section.key}
              title={section.title}
              description={section.description}
              actions={<Badge tone={full ? 'accent' : 'neutral'}>{`${ids.length} / ${section.max}`}</Badge>}
            >
              {ids.length > 0 && (
                <SortableList
                  items={ids}
                  getId={(id) => id}
                  onReorder={(next) => set({ [section.key]: next })}
                  renderItem={(id) => <StoryRow article={byId.get(id)} onRemove={() => set({ [section.key]: ids.filter((x) => x !== id) })} />}
                  className="mb-3"
                />
              )}
              {!full && <ArticlePicker articles={articles} exclude={ids} onPick={(a) => set({ [section.key]: [...ids, a.id] })} />}
            </Card>
          )
        })}
      </div>

      <SaveBar dirty={dirty} saving={saveSettings.isPending} onReset={reset} onSave={() => saveSettings.mutate({ homepage: draft })} />
    </>
  )
}
