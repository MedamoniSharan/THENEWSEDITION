import { useContent, useHomepageArticle, useHomepageArticles } from '../content/context'
import { articleHref } from '../hooks/useCategoryRoute'
import { useLanguage } from '../i18n/language'
import ArrowCorner from './ui/ArrowCorner'
import AuthorChip from './ui/AuthorChip'
import CategoryTag from './ui/CategoryTag'
import Img from './ui/Img'
import SectionHeader from './ui/SectionHeader'

export default function PopularStory() {
  const { t, tr } = useLanguage()
  const { homepage } = useContent()
  const feature = useHomepageArticle(homepage.popularFeature)
  const articles = useHomepageArticles(homepage.popular)
  if (!feature && articles.length === 0) return null

  return (
    <section id="popular" className="bg-ink py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.popularStory} variant="dark" />

        {feature && (
          <article className="group grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] rounded-br-none">
              <Img
                src={feature.image}
                width={960}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <ArrowCorner surface="ink" tone="paper" size="md" label={tr(feature.title)} href={articleHref(feature)} />
            </div>

            <div>
              <div className="mb-4">
                <CategoryTag category={feature.category} variant="pill" />
              </div>
              <h3 className="text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-[2.5rem]">
                <a href={articleHref(feature)} className="hover:text-accent">
                  {tr(feature.title)}
                </a>
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-white/60">{tr(feature.excerpt)}</p>
              <div className="mt-6">
                <AuthorChip author={feature.author} date={feature.date} variant="dark" size="md" />
              </div>
            </div>
          </article>
        )}

        {articles.length > 0 && (
          <div className={`grid gap-6 md:grid-cols-3 ${feature ? 'mt-12 border-t border-white/10 pt-10' : ''}`}>
            {articles.map((article) => (
              <article key={article.id} className="group flex gap-4">
                <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl">
                  <Img
                    src={article.image}
                    width={480}
                    sizes="112px"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between py-0.5">
                  <div>
                    <CategoryTag category={article.category} variant="text-dark" />
                    <h4 className="mt-1 line-clamp-2 text-[15px] leading-snug font-semibold text-white">
                      <a href={articleHref(article)} className="hover:text-accent">
                        {tr(article.title)}
                      </a>
                    </h4>
                  </div>
                  <div className="mt-2">
                    <AuthorChip author={article.author} variant="dark" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
