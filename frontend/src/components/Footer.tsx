import { useContent } from '../content/context'
import type { Socials } from '../content/types'
import { categoryHref, homeHref } from '../hooks/useCategoryRoute'
import { useLanguage } from '../i18n/language'
import HalftoneWordmarkFooter from './ui/halftone-wordmark-footer'
import Logo from './ui/Logo'

const socialLabels: { key: keyof Socials; label: string }[] = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'x', label: 'X' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { t, tr } = useLanguage()
  const { categories, settings } = useContent()
  const { contact } = settings

  const contactLinks = [
    contact.phone && {
      label: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
    },
    contact.email && { label: contact.email, href: `mailto:${contact.email}` },
    contact.directionsUrl && { label: t.getDirections, href: contact.directionsUrl },
    ...socialLabels
      .filter((s) => settings.socials[s.key])
      .map((s) => ({ label: s.label, href: settings.socials[s.key] })),
  ].filter((link): link is { label: string; href: string } => Boolean(link))

  const columns = [
    {
      title: t.categories,
      links: categories.slice(0, 6).map((c) => ({ label: tr(c.name), href: categoryHref(c.slug) })),
    },
    {
      title: t.sections,
      links: [
        { label: t.home, href: homeHref },
        { label: t.latestNews, href: '#latest' },
        { label: t.popularStory, href: '#popular' },
        { label: t.highlight, href: '#highlight' },
        { label: t.videos, href: '#videos' },
      ],
    },
    {
      title: t.contact,
      links: contactLinks.length ? contactLinks : [{ label: '—' }],
    },
  ]

  return (
    <div className="w-full">
      <HalftoneWordmarkFooter
        wordmark="news edition"
        brand={<Logo variant="badge" className="h-14" />}
        meta={t.copyright(currentYear)}
        columns={columns}
        preset="night"
        palette={{ warm: '#d90b0b' }}
        crop={0}
        fontFamily='"Inter Tight", "Noto Sans Telugu", "Helvetica Neue", Arial, system-ui, sans-serif'
        monoFamily='"Inter Tight", "Noto Sans Telugu", ui-sans-serif, system-ui, sans-serif'
        height="600px"
      />
    </div>
  )
}
