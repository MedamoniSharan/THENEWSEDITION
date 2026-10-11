import { popularArticles, popularFeature } from '../data/news'
import { articleHref } from '../hooks/useCategoryRoute'
import ArrowCorner from './ui/ArrowCorner'
import AuthorChip from './ui/AuthorChip'
import CategoryTag from './ui/CategoryTag'
import SectionHeader from './ui/SectionHeader'

export default function PopularStory() {
  return (
    <section id="popular" className="bg-ink py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Popular Story" variant="dark" />

        <article className="group grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] rounded-br-none">
            <img
              src={popularFeature.image}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <ArrowCorner
              surface="ink"
              tone="paper"
              size="md"
              label={popularFeature.title}
              href={articleHref(popularFeature)}
            />
          </div>

          <div>
            <div className="mb-4">
              <CategoryTag category={popularFeature.category} variant="pill" />
            </div>
            <h3 className="text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-[2.5rem]">
              <a href={articleHref(popularFeature)} className="hover:text-accent">
                {popularFeature.title}
              </a>
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-white/60">{popularFeature.excerpt}</p>
            <div className="mt-6">
              <AuthorChip
                author={popularFeature.author}
                date={popularFeature.date}
                variant="dark"
                size="md"
              />
            </div>
          </div>
        </article>

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
          {popularArticles.map((article) => (
            <article key={article.id} className="group flex gap-4">
              <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-between py-0.5">
                <div>
                  <CategoryTag category={article.category} variant="text-dark" />
                  <h4 className="mt-1 line-clamp-2 text-[15px] leading-snug font-semibold text-white">
                    <a href={articleHref(article)} className="hover:text-accent">
                      {article.title}
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
      </div>
    </section>
  )
}
