interface LogoProps {
  /** `main` is the wide wordmark for light backgrounds; `badge` is the round sub logo. */
  variant?: 'main' | 'badge'
  className?: string
}

const sources = {
  main: { src: '/brand/logo-main.webp', width: 720, height: 238 },
  badge: { src: '/brand/logo-badge.webp', width: 320, height: 306 },
} as const

export default function Logo({ variant = 'main', className }: LogoProps) {
  const { src, width, height } = sources[variant]
  const sizeClass = className ?? (variant === 'main' ? 'h-14 md:h-20' : 'h-16')

  return (
    <a href="#/" className="inline-flex shrink-0 items-center" aria-label="TheNewsEdition home">
      <img src={src} width={width} height={height} alt="The News Edition" className={`${sizeClass} w-auto`} />
    </a>
  )
}
