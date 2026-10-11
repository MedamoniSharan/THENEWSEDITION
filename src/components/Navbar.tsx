import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navCategories } from '../data/news'
import Logo from './ui/Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('Home')

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
        className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full z-30 mt-2 flex-col gap-1 rounded-2xl bg-white p-3 shadow-lg md:static md:mt-6 md:flex md:flex-row md:justify-center md:gap-10 md:bg-transparent md:p-0 md:shadow-none`}
      >
        {navCategories.map((item) => (
          <a
            key={item}
            href="#"
            onClick={() => {
              setActive(item)
              setOpen(false)
            }}
            className={`rounded-lg px-3 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors md:px-0 md:py-1 ${
              active === item
                ? 'text-accent'
                : 'text-ink/60 hover:text-ink'
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  )
}
