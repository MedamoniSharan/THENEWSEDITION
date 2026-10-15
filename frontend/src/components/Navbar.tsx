import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useContent } from '../content/context'
import { prefetchCategory } from '../content/useCategoryArticles'
import { categoryHref, homeHref } from '../hooks/useCategoryRoute'
import { useLanguage } from '../i18n/language'
import LanguageToggle from './ui/LanguageToggle'
import Logo from './ui/Logo'

interface NavbarProps {
  activeSlug?: string
}

export default function Navbar({ activeSlug }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const { t, tr } = useLanguage()
  const { categories } = useContent()

  const navItems = [
    { label: t.home, href: homeHref, slug: undefined },
    ...categories.map((c) => ({ label: tr(c.name), href: categoryHref(c.slug), slug: c.slug })),
  ]

  return (
    <header className="relative pt-6 pb-4">
      <div className="relative flex items-center justify-between gap-3 md:justify-center">
        <Logo />
        <div className="flex items-center gap-2 md:absolute md:top-1/2 md:right-0 md:-translate-y-1/2">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full bg-white shadow-sm md:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <nav
        className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full z-30 mt-2 flex-col gap-1 rounded-2xl bg-white p-3 shadow-lg md:static md:mt-6 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-x-7 md:gap-y-2 md:bg-transparent md:p-0 md:shadow-none lg:gap-x-10`}
      >
        {navItems.map((item) => {
          const active = item.slug === activeSlug
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              onPointerEnter={item.slug ? () => prefetchCategory(item.slug!) : undefined}
              onFocus={item.slug ? () => prefetchCategory(item.slug!) : undefined}
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
