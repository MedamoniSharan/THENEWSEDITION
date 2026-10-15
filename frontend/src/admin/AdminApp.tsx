import { useEffect, useState, type ComponentType, type FormEvent } from 'react'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ExternalLink,
  House,
  Images,
  KeyRound,
  LayoutDashboard,
  Menu,
  MessageSquareQuote,
  MonitorPlay,
  Newspaper,
  Clapperboard,
  Settings as SettingsIcon,
  Tags,
  Type,
  X,
  Zap,
} from 'lucide-react'
import { api, ApiError } from './api'
import Link from './Link'
import { usePath } from './router'
import { toast } from './toast'
import Toaster from './Toaster'
import PageLoader from '../components/ui/PageLoader'
import { Button, Field, Input } from './ui'
import Account from './pages/Account'
import Articles from './pages/Articles'
import Categories from './pages/Categories'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'
import HotNews from './pages/HotNews'
import MediaLibrary from './pages/MediaLibrary'
import Reels from './pages/Reels'
import SettingsPage from './pages/Settings'
import SiteText from './pages/SiteText'
import Testimonials from './pages/Testimonials'
import Videos from './pages/Videos'

interface Page {
  path: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  component: ComponentType
}

const pages: Page[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, component: Dashboard },
  { path: '/admin/homepage', label: 'Homepage layout', icon: House, component: Homepage },
  { path: '/admin/articles', label: 'Articles', icon: Newspaper, component: Articles },
  { path: '/admin/categories', label: 'Categories', icon: Tags, component: Categories },
  { path: '/admin/hot-news', label: 'Hot News ticker', icon: Zap, component: HotNews },
  { path: '/admin/videos', label: 'YouTube videos', icon: MonitorPlay, component: Videos },
  { path: '/admin/reels', label: 'Reels', icon: Clapperboard, component: Reels },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, component: Testimonials },
  { path: '/admin/media', label: 'Media library', icon: Images, component: MediaLibrary },
  { path: '/admin/settings', label: 'Site settings', icon: SettingsIcon, component: SettingsPage },
  { path: '/admin/site-text', label: 'Site text', icon: Type, component: SiteText },
  { path: '/admin/account', label: 'Account & password', icon: KeyRound, component: Account },
]

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    // Refetching on focus would overwrite edits in progress, so data refreshes only after saves.
    queries: { refetchOnWindowFocus: false, retry: (count, err) => !(err instanceof ApiError && err.status < 500) && count < 2, staleTime: 30_000 },
  },
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) queryClient.setQueryData(['me'], null)
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) queryClient.setQueryData(['me'], null)
      toast.error(err.message)
    },
  }),
})

function Login() {
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useMutation({
    mutationFn: () => api.post<{ email: string }>('/auth/login', { email, password }),
    onSuccess: (me) => qc.setQueryData(['me'], me),
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    login.mutate()
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
        <img src="/brand/logo-main.webp" alt="TheNewsEdition" className="mx-auto h-12 w-auto" />
        <h1 className="mt-6 text-center text-xl font-semibold text-ink">Admin sign in</h1>
        <div className="mt-6 space-y-4">
          <Field label="Email">
            {(id) => <Input id={id} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />}
          </Field>
          <Field label="Password">
            {(id) => (
              <Input id={id} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            )}
          </Field>
        </div>
        <Button type="submit" variant="primary" className="mt-6 w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>
    </div>
  )
}

function Sidebar({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {pages.map(({ path: to, label, icon: Icon }) => {
        const active = path === to
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={17} className={active ? 'text-accent' : ''} />
            {label}
          </Link>
        )
      })}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
      >
        <ExternalLink size={17} />
        View website
      </a>
    </nav>
  )
}

function Layout({ email }: { email: string }) {
  const path = usePath().replace(/\/$/, '') || '/admin'
  const [menuOpen, setMenuOpen] = useState(false)
  const page = pages.find((p) => p.path === path) ?? pages[0]
  const Page = page.component

  useEffect(() => {
    document.title = `${page.label} · TheNewsEdition admin`
  }, [page])

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="hidden w-60 shrink-0 bg-ink lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          <div className="px-6 pt-6 pb-2">
            <img src="/brand/logo-badge.webp" alt="TheNewsEdition" className="h-10 w-auto" />
            <p className="mt-3 truncate text-xs text-white/40">{email}</p>
          </div>
          <Sidebar path={path} />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <img src="/brand/logo-badge.webp" alt="TheNewsEdition" className="h-8 w-auto" />
        <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="text-white">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-ink lg:hidden">
          <Sidebar path={path} onNavigate={() => setMenuOpen(false)} />
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <Page />
        </div>
      </main>
    </div>
  )
}

function Gate() {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<{ email: string } | null>('/auth/me'),
    staleTime: Infinity,
  })

  if (me.isPending) return <PageLoader />
  if (me.isError) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <p className="font-semibold text-ink">Could not reach the server</p>
          <p className="mt-1 text-sm text-ink/55">{me.error.message}</p>
          <Button className="mt-4" onClick={() => void me.refetch()}>
            Try again
          </Button>
        </div>
      </div>
    )
  }
  return me.data ? <Layout email={me.data.email} /> : <Login />
}

export default function AdminApp() {
  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Gate />
      <Toaster />
    </QueryClientProvider>
  )
}
