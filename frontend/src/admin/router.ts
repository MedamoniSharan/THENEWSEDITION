import { useEffect, useSyncExternalStore } from 'react'

const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb)
  return () => window.removeEventListener('popstate', cb)
}

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname)

/** Forms with unsaved edits register here so leaving the page asks first. */
const dirtyForms = new Set<symbol>()

export function confirmDiscard() {
  return dirtyForms.size === 0 || window.confirm('You have unsaved changes. Leave without saving?')
}

export function navigate(to: string) {
  if (to === window.location.pathname || !confirmDiscard()) return
  dirtyForms.clear()
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}

export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return
    const token = Symbol('form')
    dirtyForms.add(token)
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      dirtyForms.delete(token)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [dirty])
}
