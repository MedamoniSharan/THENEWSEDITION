import { slugOf, type Category } from '../../data/news'
import { categoryHref } from '../../hooks/useCategoryRoute'

interface CategoryTagProps {
  category: Category
  /** `pill` sits on top of images; `text` and `text-dark` sit above titles on light or dark backgrounds. */
  variant?: 'pill' | 'text' | 'text-dark'
}

const variantClass = {
  pill: 'w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] text-white backdrop-blur hover:bg-accent',
  text: 'text-[10px] text-accent hover:underline',
  'text-dark': 'text-[10px] text-[#ff6b5e] hover:underline',
}

export default function CategoryTag({ category, variant = 'text' }: CategoryTagProps) {
  const className = variantClass[variant]

  return (
    <a
      href={categoryHref(slugOf(category))}
      className={`relative z-10 inline-block font-semibold tracking-wider uppercase transition-colors ${className}`}
    >
      {category}
    </a>
  )
}
