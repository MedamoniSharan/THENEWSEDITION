import { ChevronRight } from 'lucide-react'
import { articlesInCategory, categories, type CategoryInfo } from '../data/news'
import { categoryHref, homeHref } from '../hooks/useCategoryRoute'
import ArticleCard from './ui/ArticleCard'
import FeatureCard from './ui/FeatureCard'

interface CategoryPageProps {
  category: CategoryInfo
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [lead, ...rest] = articlesInCategory(category.name)

  return (
    <section className="pt-6 pb-14 md:pt-10 md:pb-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink/50">
        <a href={homeHref} className="hover:text-accent">
          Home
        </a>
        <ChevronRight size={14} aria-hidden />
        <span className="font-medium text-ink">{category.name}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">{category.name}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60 md:text-base">
            {category.description}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm">
          {lead ? rest.length + 1 : 0} {rest.length === 0 && lead ? 'story' : 'stories'}
        </span>
      </div>

      <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((c) => {
          const active = c.slug === category.slug
          return (
            <a
              key={c.slug}
              href={categoryHref(c.slug)}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                active ? 'bg-accent text-white' : 'bg-white text-ink/70 hover:bg-ink hover:text-white'
              }`}
            >
              {c.name}
            </a>
          )
        })}
      </div>

      {lead ? (
        <>
          <div className="mt-8">
            <FeatureCard article={lead} tone="accent" showCategory={false} />
          </div>

          {rest.length > 0 && (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} showCategory={false} showDate />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-[28px] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink">No stories in {category.name} yet</p>
          <p className="mt-2 text-sm text-ink/60">Check back soon, or browse another category above.</p>
        </div>
      )}
    </section>
  )
}
