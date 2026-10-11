import type { Article } from '../../data/news'
import { articleHref } from '../../hooks/useCategoryRoute'
import ArrowCorner from './ArrowCorner'
import AuthorChip from './AuthorChip'
import CategoryTag from './CategoryTag'

interface FeatureCardProps {
  article: Article
  tone?: 'accent' | 'ink'
  showCategory?: boolean
}

export default function FeatureCard({ article, tone = 'ink', showCategory = true }: FeatureCardProps) {
  return (
    <article className="group relative min-h-[440px] overflow-hidden rounded-[28px] rounded-br-none md:min-h-[560px]">
      <img
        src={article.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 pr-28 md:p-10 md:pr-40">
        {showCategory && (
          <div className="mb-4">
            <CategoryTag category={article.category} variant="pill" />
          </div>
        )}
        <h3 className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-5xl">
          <a href={articleHref(article)}>{article.title}</a>
        </h3>
        <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-relaxed text-white/70">{article.excerpt}</p>
        <div className="mt-5">
          <AuthorChip author={article.author} date={article.date} variant="dark" size="md" />
        </div>
      </div>

      <ArrowCorner size="lg" tone={tone} label={article.title} href={articleHref(article)} />
    </article>
  )
}
