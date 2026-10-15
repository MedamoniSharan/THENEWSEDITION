import type { Article } from '../../content/types'
import { articleHref } from '../../hooks/useCategoryRoute'
import { useLanguage } from '../../i18n/language'
import AuthorChip from './AuthorChip'
import CategoryTag from './CategoryTag'
import Img from './Img'

interface ArticleCardProps {
  article: Article
  showCategory?: boolean
  showDate?: boolean
}

export default function ArticleCard({ article, showCategory = true, showDate = false }: ArticleCardProps) {
  const { tr } = useLanguage()

  return (
    <article className="group flex flex-col">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl">
        <Img
          src={article.image}
          width={480}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {showCategory && (
        <div className="mt-4">
          <CategoryTag category={article.category} />
        </div>
      )}
      <h4
        className={`line-clamp-3 text-base leading-snug font-semibold text-ink ${showCategory ? 'mt-1' : 'mt-4'}`}
      >
        <a href={articleHref(article)} className="hover:text-accent">
          {tr(article.title)}
        </a>
      </h4>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/55">{tr(article.excerpt)}</p>
      <div className="mt-auto pt-4">
        <AuthorChip author={article.author} date={showDate ? article.date : undefined} />
      </div>
    </article>
  )
}
