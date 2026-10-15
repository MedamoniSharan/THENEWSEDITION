import { ArrowRight, Languages } from 'lucide-react'
import { useStats } from '../hooks'
import Link from '../Link'
import { Card, PageHeader } from '../ui'

const shortcuts = [
  { to: '/admin/articles', title: 'Write or edit articles', text: 'Headlines, summaries, photos and authors in English and Telugu.' },
  { to: '/admin/homepage', title: 'Arrange the homepage', text: 'Drag stories into the top story, Latest News, Popular and Highlight sections.' },
  { to: '/admin/hot-news', title: 'Update Hot News', text: 'The scrolling headlines at the very top of every page.' },
  { to: '/admin/videos', title: 'YouTube videos', text: 'Paste a YouTube link; the first video autoplays on the homepage.' },
  { to: '/admin/media', title: 'Upload images and videos', text: 'Drag and drop files; images are optimised for fast loading.' },
  { to: '/admin/settings', title: 'Site settings', text: 'Tagline, intro video, contact details and social links.' },
]

export default function Dashboard() {
  const { data: stats } = useStats()

  const tiles = [
    { label: 'Articles', value: stats ? `${stats.published} / ${stats.articles}` : '–', note: 'published / total' },
    { label: 'Categories', value: stats?.categories ?? '–' },
    { label: 'Reels', value: stats?.reels ?? '–' },
    { label: 'Testimonials', value: stats?.quotes ?? '–' },
    { label: 'Media files', value: stats?.media ?? '–' },
  ]

  return (
    <>
      <PageHeader title="Dashboard" description="Everything on the website is managed here. Changes go live as soon as you save." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <p className="text-xs font-semibold tracking-wide text-ink/50 uppercase">{tile.label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{tile.value}</p>
            {tile.note && <p className="text-[11px] text-ink/40">{tile.note}</p>}
          </div>
        ))}
      </div>

      {stats && stats.missingTelugu > 0 && (
        <Link
          to="/admin/articles"
          className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
        >
          <Languages size={18} className="shrink-0" />
          <span className="flex-1">
            {stats.missingTelugu} article{stats.missingTelugu === 1 ? ' is' : 's are'} missing a Telugu title or summary. Readers using Telugu see the English text instead.
          </span>
          <ArrowRight size={16} />
        </Link>
      )}

      <Card title="Quick links" className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((s) => (
            <Link key={s.to} to={s.to} className="group rounded-xl p-4 ring-1 ring-ink/10 transition hover:ring-accent/40">
              <p className="flex items-center justify-between font-semibold text-ink">
                {s.title}
                <ArrowRight size={16} className="text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </p>
              <p className="mt-1 text-sm text-ink/55">{s.text}</p>
            </Link>
          ))}
        </div>
      </Card>
    </>
  )
}
