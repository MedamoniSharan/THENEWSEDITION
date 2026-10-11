import { categoryBySlug, type CategorySlug } from '../../data/news'
import { categoryHref } from '../../hooks/useCategoryRoute'
import { useLanguage } from '../../i18n/language'

interface CategoryTagProps {
  category: CategorySlug
  /** `pill` sits on top of images; `text` and `text-dark` sit above titles on light or dark backgrounds. */
  variant?: 'pill' | 'text' | 'text-dark'
}

const variantClass = {
  pill: 'w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] text-white backdrop-blur hover:bg-accent',
  text: 'text-[10px] text-accent hover:underline',
  'text-dark': 'text-[10px] text-[#ff6b5e] hover:underline',
}

export default function CategoryTag({ category, variant = 'text' }: CategoryTagProps) {
  const { tr } = useLanguage()
  const className = variantClass[variant]

  return (
    <a
      href={categoryHref(category)}
      className={`relative z-10 inline-block font-semibold tracking-wider uppercase transition-colors ${className}`}
    >
      {tr(categoryBySlug(category)!.name)}
    </a>
  )
}
