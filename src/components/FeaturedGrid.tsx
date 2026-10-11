import { heroArticle, sideArticles, type Article } from '../data/news'
import ArrowCorner from './ui/ArrowCorner'
import AuthorChip from './ui/AuthorChip'

function SideStory({ article }: { article: Article }) {
  return (
    <article className="group flex gap-4">
      <div className="relative h-32 w-36 shrink-0 overflow-hidden rounded-2xl rounded-bl-none sm:w-44">
        <img
          src={article.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <ArrowCorner size="sm" tone="ink" position="bl" label={article.title} />
      </div>
      <div className="flex min-w-0 flex-col justify-between py-0.5">
        <div>
          <h3 className="line-clamp-3 text-base leading-snug font-semibold text-ink">
            <a href="#" className="hover:text-accent">
              {article.title}
            </a>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/55">{article.excerpt}</p>
        </div>
        <div className="mt-2">
          <AuthorChip author={article.author} />
        </div>
      </div>
    </article>
  )
}

export default function FeaturedGrid() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <article className="group relative min-h-[420px] overflow-hidden rounded-[28px] rounded-br-none md:min-h-[520px]">
        <img
          src={heroArticle.image}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 pr-28 md:p-10 md:pr-36">
          <span className="mb-4 w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur">
            {heroArticle.category}
          </span>
          <h2 className="max-w-xl text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-[2.75rem]">
            <a href="#">{heroArticle.title}</a>
          </h2>
          <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/70">
            {heroArticle.excerpt}
          </p>
          <div className="mt-5">
            <AuthorChip author={heroArticle.author} date={heroArticle.date} variant="dark" size="md" />
          </div>
        </div>

        <ArrowCorner size="lg" tone="accent" label={heroArticle.title} />
      </article>

      <div className="flex flex-col justify-between gap-6">
        {sideArticles.map((article) => (
          <SideStory key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
