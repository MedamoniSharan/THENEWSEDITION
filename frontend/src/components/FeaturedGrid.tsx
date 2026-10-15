import { useContent, useHomepageArticle, useHomepageArticles } from '../content/context'
import type { Article } from '../content/types'
import { articleHref } from '../hooks/useCategoryRoute'
import { useLanguage } from '../i18n/language'
import ArrowCorner from './ui/ArrowCorner'
import AuthorChip from './ui/AuthorChip'
import CategoryTag from './ui/CategoryTag'
import Img from './ui/Img'

function SideStory({ article }: { article: Article }) {
  const { tr } = useLanguage()
  const title = tr(article.title)

  return (
    <article className="group flex gap-4">
      <div className="relative h-32 w-36 shrink-0 overflow-hidden rounded-2xl rounded-bl-none sm:w-44">
        <Img
          src={article.image}
          width={480}
          sizes="176px"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <ArrowCorner size="sm" tone="ink" position="bl" label={title} href={articleHref(article)} />
      </div>
      <div className="flex min-w-0 flex-col justify-between py-0.5">
        <div>
          <CategoryTag category={article.category} />
          <h3 className="mt-1 line-clamp-2 text-base leading-snug font-semibold text-ink">
            <a href={articleHref(article)} className="hover:text-accent">
              {title}
            </a>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/55">{tr(article.excerpt)}</p>
        </div>
        <div className="mt-2">
          <AuthorChip author={article.author} />
        </div>
      </div>
    </article>
  )
}

export default function FeaturedGrid() {
  const { tr } = useLanguage()
  const { homepage } = useContent()
  const hero = useHomepageArticle(homepage.hero)
  const side = useHomepageArticles(homepage.side)
  if (!hero && side.length === 0) return null

  return (
    <section className={`grid gap-6 ${hero && side.length ? 'lg:grid-cols-[1.55fr_1fr]' : ''}`}>
      {hero && (
        <article className="group relative min-h-[420px] overflow-hidden rounded-[28px] rounded-br-none md:min-h-[520px]">
          <Img
            src={hero.image}
            width={1600}
            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 60vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 pr-28 md:p-10 md:pr-36">
            <div className="mb-4">
              <CategoryTag category={hero.category} variant="pill" />
            </div>
            <h2 className="max-w-xl text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-[2.75rem]">
              <a href={articleHref(hero)}>{tr(hero.title)}</a>
            </h2>
            <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/70">{tr(hero.excerpt)}</p>
            <div className="mt-5">
              <AuthorChip author={hero.author} date={hero.date} variant="dark" size="md" />
            </div>
          </div>

          <ArrowCorner size="lg" tone="accent" label={tr(hero.title)} href={articleHref(hero)} />
        </article>
      )}

      {side.length > 0 && (
        <div className="flex flex-col justify-between gap-6">
          {side.map((article) => (
            <SideStory key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}
