import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { categories } from '../data/news'
import { categoryHref, homeHref } from '../hooks/useCategoryRoute'
import Logo from './ui/Logo'

interface NavbarProps {
  activeSlug?: string
}

const navItems = [
  { label: 'Home', href: homeHref, slug: undefined },
  ...categories.map((c) => ({ label: c.name, href: categoryHref(c.slug), slug: c.slug as string })),
]

export default function Navbar({ activeSlug }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative pt-6 pb-4">
      <div className="flex items-center justify-between md:justify-center">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full bg-white shadow-sm md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav
        className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full z-30 mt-2 flex-col gap-1 rounded-2xl bg-white p-3 shadow-lg md:static md:mt-6 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-x-7 md:gap-y-2 md:bg-transparent md:p-0 md:shadow-none lg:gap-x-10`}
      >
        {navItems.map((item) => {
          const active = item.slug === activeSlug
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-colors md:px-0 md:py-1 ${
                active ? 'text-accent' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
