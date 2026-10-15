import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Surface = 'paper' | 'ink' | 'white'
type Tone = 'accent' | 'ink' | 'paper'
type Size = 'sm' | 'md' | 'lg'

interface ArrowCornerProps {
  /** Color of the background the card sits on, used to paint the cut-out. */
  surface?: Surface
  tone?: Tone
  size?: Size
  position?: 'br' | 'bl'
  href: string
  label?: string
}

const surfaceColor: Record<Surface, string> = {
  paper: 'var(--color-paper)',
  ink: 'var(--color-ink)',
  white: '#ffffff',
}

const toneClass: Record<Tone, string> = {
  accent: 'bg-accent text-white hover:bg-accent-dark',
  ink: 'bg-ink text-white hover:bg-black',
  paper: 'bg-white text-ink hover:bg-paper',
}

const sizeConfig: Record<Size, { radius: number; pad: string; button: string; icon: number }> = {
  sm: { radius: 14, pad: 'p-1', button: 'size-8 rounded-[10px]', icon: 16 },
  md: { radius: 20, pad: 'p-2', button: 'size-12 rounded-2xl', icon: 22 },
  lg: { radius: 28, pad: 'p-3', button: 'size-16 md:size-20 rounded-[22px]', icon: 34 },
}

export default function ArrowCorner({
  surface = 'paper',
  tone = 'accent',
  size = 'md',
  position = 'br',
  href,
  label = 'Read article',
}: ArrowCornerProps) {
  const { radius, pad, button, icon } = sizeConfig[size]
  const style = { '--cut': surfaceColor[surface], '--r': `${radius}px` } as CSSProperties
  const isRight = position === 'br'

  return (
    <div className={`absolute bottom-0 z-10 ${isRight ? 'right-0' : 'left-0'}`} style={style}>
      <span
        aria-hidden
        className={`absolute bottom-full size-(--r) ${isRight ? 'right-0 corner-cut-l' : 'left-0 corner-cut-r'}`}
      />
      <span
        aria-hidden
        className={`absolute bottom-0 size-(--r) ${isRight ? 'right-full corner-cut-l' : 'left-full corner-cut-r'}`}
      />
      <div
        className={`bg-(--cut) ${pad} ${isRight ? 'rounded-tl-(--r)' : 'rounded-tr-(--r)'}`}
      >
        <a
          href={href}
          aria-label={label}
          className={`group/arrow grid place-items-center transition-colors ${button} ${toneClass[tone]}`}
        >
          <ArrowUpRight
            size={icon}
            strokeWidth={2.25}
            className="transition-transform duration-300 group-hover/arrow:-translate-y-0.5 group-hover/arrow:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  )
}
