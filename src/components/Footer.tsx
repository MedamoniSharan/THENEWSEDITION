import type { ReactNode } from 'react'
import { categories } from '../data/news'
import { categoryHref, homeHref } from '../hooks/useCategoryRoute'
import Logo from './ui/Logo'

const socials: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4V21H3zM9.5 9.75h3.83v1.54h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.13V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.92 1.3-1.92 2.63V21h-4z" />
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3.05.01-4.1.06C4.9 2.2 2.2 4.9 2.06 7.9 2.01 8.95 2 9.3 2 12s.01 3.05.06 4.1c.14 3 2.84 5.7 5.84 5.84 1.05.05 1.4.06 4.1.06s3.05-.01 4.1-.06c3-.14 5.7-2.84 5.84-5.84.05-1.05.06-1.4.06-4.1s-.01-3.05-.06-4.1C21.8 4.9 19.1 2.2 16.1 2.06 15.05 2.01 14.7 2 12 2zm0 1.8c2.67 0 2.99.01 4.04.06 2.12.1 3.99 1.97 4.1 4.1.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.11 2.13-1.98 4-4.1 4.1-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-2.12-.1-3.99-1.97-4.1-4.1C3.81 14.99 3.8 14.67 3.8 12s.01-2.99.06-4.04c.11-2.13 1.98-4 4.1-4.1C9.01 3.81 9.33 3.8 12 3.8z" />
    ),
  },
  {
    label: 'X',
    href: '#',
    icon: (
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.17h1.7L7.4 4.74H5.58z" />
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.55V4.63A20.6 20.6 0 0 0 14.25 4.5c-2.24 0-3.77 1.37-3.77 3.88v2.18H7.95v2.94h2.53V21z" />
    ),
  },
]

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Categories',
    links: categories.map((c) => ({ label: c.name, href: categoryHref(c.slug) })),
  },
  {
    title: 'Sections',
    links: [
      { label: 'Home', href: homeHref },
      { label: 'Latest News', href: '#latest' },
      { label: 'Popular Story', href: '#popular' },
      { label: 'Highlight', href: '#highlight' },
    ],
  },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-10 sm:px-6 md:grid-cols-[auto_1fr] lg:px-8">
        <div className="flex gap-8 md:flex-col md:items-start">
          <Logo variant="badge" className="h-16 md:h-20" />
          <span className="hidden h-24 w-px bg-accent md:block" aria-hidden />
          <ul className="flex gap-3 md:mt-auto md:flex-col">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                    {s.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 md:justify-items-end">
          {columns.map((col) => (
            <div key={col.title} className="md:min-w-40">
              <h3 className="text-xs font-semibold tracking-[0.14em] text-white/40 uppercase">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-white/80 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:min-w-40">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-white/40 uppercase">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <a href="tel:+11234567890" className="hover:text-accent">
                  +1 (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:hello@thenewsedition.com" className="hover:text-accent">
                  hello@thenewsedition.com
                </a>
              </li>
              <li>
                <a href="#" className="text-accent underline underline-offset-4 hover:text-white">
                  Get Directions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 py-6 text-xs text-white/40 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <span>THENEWSEDITION</span>
        <span>© {currentYear} TheNewsEdition. All rights reserved.</span>
      </div>
    </footer>
  )
}
