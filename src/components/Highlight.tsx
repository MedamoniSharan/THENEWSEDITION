import { highlightArticles, highlightFeature } from '../data/news'
import ArrowCorner from './ui/ArrowCorner'
import AuthorChip from './ui/AuthorChip'
import SectionHeader from './ui/SectionHeader'

export default function Highlight() {
  return (
    <section className="py-14 md:py-20">
      <SectionHeader title="Highlight" />

      <article className="group relative min-h-[440px] overflow-hidden rounded-[28px] rounded-br-none md:min-h-[560px]">
        <img
          src={highlightFeature.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 pr-28 md:p-10 md:pr-40">
          <h3 className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-5xl">
            <a href="#">{highlightFeature.title}</a>
          </h3>
          <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-relaxed text-white/70">
            {highlightFeature.excerpt}
          </p>
          <div className="mt-5">
            <AuthorChip
              author={highlightFeature.author}
              date={highlightFeature.date}
              variant="dark"
              size="md"
            />
          </div>
        </div>

        <ArrowCorner size="lg" tone="ink" label={highlightFeature.title} />
      </article>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {highlightArticles.map((article) => (
          <article key={article.id} className="group flex flex-col">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={article.image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4 className="mt-4 line-clamp-3 text-base leading-snug font-semibold text-ink">
              <a href="#" className="hover:text-accent">
                {article.title}
              </a>
            </h4>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/55">{article.excerpt}</p>
            <div className="mt-auto pt-4">
              <AuthorChip author={article.author} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
