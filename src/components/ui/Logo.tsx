interface LogoProps {
  variant?: 'light' | 'dark'
  showText?: boolean
}

export default function Logo({ variant = 'light', showText = true }: LogoProps) {
  const isDark = variant === 'dark'

  return (
    <a href="#" className="inline-flex items-center gap-2" aria-label="TheNewsEdition home">
      <span
        className={`grid size-8 place-items-center rounded-full border-2 ${isDark ? 'border-white' : 'border-ink'}`}
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path d="M5 5h14v3.5h-5.25V19h-3.5V8.5H5z" className="fill-accent" />
        </svg>
      </span>
      {showText && (
        <span
          className={`text-sm font-bold tracking-[0.18em] ${isDark ? 'text-white' : 'text-ink'}`}
        >
          THENEWSEDITION
        </span>
      )}
    </a>
  )
}
