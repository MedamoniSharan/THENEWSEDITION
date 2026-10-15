import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import { useUnsavedGuard } from './router'
import { toast } from './toast'
import type { ArticleRecord, Asset, CategoryRecord, QuoteRecord, ReelRecord, SettingsRecord, Stats } from './types'

type CollectionName = 'articles' | 'categories' | 'reels' | 'quotes'
interface CollectionTypes {
  articles: ArticleRecord
  categories: CategoryRecord
  reels: ReelRecord
  quotes: QuoteRecord
}

/** List + create/update/delete/reorder for one admin collection. */
export function useCollection<N extends CollectionName>(name: N) {
  type Item = CollectionTypes[N]
  const qc = useQueryClient()
  const key = [name]
  const query = useQuery({ queryKey: key, queryFn: () => api.get<Item[]>(`/admin/${name}`) })

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: key })
    void qc.invalidateQueries({ queryKey: ['stats'] })
  }

  const save = useMutation({
    mutationFn: (item: Partial<Item> & { id?: string }) =>
      item.id ? api.put<Item>(`/admin/${name}/${item.id}`, item) : api.post<Item>(`/admin/${name}`, item),
    onSuccess: () => {
      refresh()
      toast.success('Saved. The website is updated.')
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.del(`/admin/${name}/${id}`),
    onSuccess: () => {
      refresh()
      if (name === 'articles') void qc.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Deleted')
    },
  })

  const reorder = useMutation({
    mutationFn: (items: Item[]) => api.put<void>(`/admin/${name}/order`, { ids: items.map((i) => i.id) }),
    onMutate: (items) => {
      const previous = qc.getQueryData<Item[]>(key)
      qc.setQueryData(key, items)
      return { previous }
    },
    onError: (_err, _items, context) => context?.previous && qc.setQueryData(key, context.previous),
    onSuccess: () => toast.success('New order saved'),
  })

  return { ...query, items: query.data ?? [], save, remove, reorder }
}

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: () => api.get<SettingsRecord>('/admin/settings') })
}

export function useSaveSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (changes: Partial<SettingsRecord>) => api.put<SettingsRecord>('/admin/settings', changes),
    onSuccess: (settings) => {
      qc.setQueryData(['settings'], settings)
      toast.success('Saved. The website is updated.')
    },
  })
}

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: () => api.get<Stats>('/admin/stats') })
}

export function useMedia(kind?: Asset['kind']) {
  return useQuery({
    queryKey: ['media', kind ?? 'all'],
    queryFn: () => api.get<Asset[]>(`/admin/media${kind ? `?kind=${kind}` : ''}`),
  })
}

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/**
 * Local editable copy of server data. Resets when the saved data changes (e.g. after saving)
 * and warns before leaving the page with unsaved edits.
 */
export function useDraft<T>(source: T | undefined) {
  const [base, setBase] = useState(source)
  const [draft, setDraft] = useState(source)
  if (!sameJson(source, base)) {
    setBase(source)
    setDraft(source)
  }
  const dirty = draft !== undefined && !sameJson(draft, source)
  useUnsavedGuard(dirty)
  const reset = useCallback(() => setDraft(base), [base])
  return { draft, setDraft: setDraft as (next: T | ((prev: T) => T)) => void, dirty, reset }
}
