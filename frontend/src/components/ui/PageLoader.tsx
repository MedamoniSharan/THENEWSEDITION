import { useState } from 'react'

/**
 * Full-screen loader matching the one in `index.html` (styles live there too).
 * It fades in after a short delay so fast loads show nothing, unless the page has already been
 * loading a while, in which case the HTML loader was on screen and this one must take over without a blink.
 */
export default function PageLoader({ dark = false, label = 'Loading' }: { dark?: boolean; label?: string }) {
  const [instant] = useState(() => performance.now() > 600)

  return (
    <div
      className={`tne-loader ${instant ? 'tne-loader--instant' : ''} ${dark ? 'tne-loader--dark' : ''}`}
      role="status"
      aria-label={label}
    >
      <img src="/brand/logo-badge.webp" width={320} height={306} alt="" />
      <span className="tne-loader-bar" />
    </div>
  )
}
