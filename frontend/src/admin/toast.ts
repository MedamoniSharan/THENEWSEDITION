export interface Toast {
  id: number
  kind: 'success' | 'error'
  message: string
}

let toasts: Toast[] = []
let nextId = 1
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

function show(kind: Toast['kind'], message: string) {
  const id = nextId++
  toasts = [...toasts.slice(-3), { id, kind, message }]
  emit()
  setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 3000)
}

export const toast = {
  success: (message: string) => show('success', message),
  error: (message: string) => show('error', message),
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getToasts = () => toasts
