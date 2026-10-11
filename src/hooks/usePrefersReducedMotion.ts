import { useEffect, useState } from 'react'

const query = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => window.matchMedia(query).matches

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
