import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'

export default function HeroSearch() {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <section className="py-10 text-center md:py-14">
      <h1 className="mx-auto max-w-2xl text-4xl leading-[1.1] font-semibold tracking-tight text-ink md:text-6xl">
        Find News that Meet With Your Needs
      </h1>

      <form
        onSubmit={handleSubmit}
        role="search"
        className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      >
        <Search size={18} className="shrink-0 text-accent" />
        <label htmlFor="news-search" className="sr-only">
          Search news
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your recent news..."
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Search Now
        </button>
      </form>
    </section>
  )
}
