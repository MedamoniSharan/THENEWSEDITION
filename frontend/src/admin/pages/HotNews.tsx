import { useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Localized } from '../../i18n/types'
import BilingualField from '../BilingualField'
import { useDraft, useSaveSettings, useSettings } from '../hooks'
import SortableList from '../SortableList'
import { Button, Card, EmptyState, IconButton, LoadingBlock, PageHeader, SaveBar } from '../ui'

type Headline = Localized & { key: string }
let nextKey = 0

export default function HotNews() {
  const { data: settings, isPending } = useSettings()
  const save = useSaveSettings()
  // Rows need stable keys for drag and drop; they are stripped again when saving.
  const source = useMemo(() => settings?.ticker.map((h, i): Headline => ({ ...h, key: `saved-${i}` })), [settings])
  const { draft, setDraft, dirty, reset } = useDraft(source)

  if (isPending || !draft) return <LoadingBlock />

  const update = (key: string, value: Localized) => setDraft((list) => list.map((h) => (h.key === key ? { ...value, key } : h)))
  const add = () => setDraft((list) => [...list, { en: '', te: '', key: `new-${nextKey++}` }])

  return (
    <>
      <PageHeader
        title="Hot News ticker"
        description="Short headlines that scroll across the top of every page. Drag to change the order."
        actions={
          <Button variant="primary" icon={<Plus size={16} />} onClick={add}>
            Add headline
          </Button>
        }
      />

      <Card>
        {draft.length === 0 ? (
          <EmptyState title="No headlines">The Hot News bar is hidden until you add one.</EmptyState>
        ) : (
          <SortableList
            items={draft}
            getId={(h) => h.key}
            onReorder={setDraft}
            renderItem={(h, i) => (
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <BilingualField compact label={`Headline ${i + 1}`} value={h} onChange={(v) => update(h.key, v)} />
                </div>
                <IconButton label="Delete headline" className="mt-5" onClick={() => setDraft((list) => list.filter((x) => x.key !== h.key))}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            )}
          />
        )}
      </Card>

      <SaveBar
        dirty={dirty}
        saving={save.isPending}
        onReset={reset}
        onSave={() => save.mutate({ ticker: draft.filter((h) => h.en.trim() || h.te.trim()).map(({ en, te }) => ({ en, te })) })}
      />
    </>
  )
}
