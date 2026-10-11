import { highlightArticles, highlightFeature } from '../data/news'
import { useLanguage } from '../i18n/language'
import ArticleCard from './ui/ArticleCard'
import FeatureCard from './ui/FeatureCard'
import SectionHeader from './ui/SectionHeader'

export default function Highlight() {
  const { t } = useLanguage()

  return (
    <section id="highlight" className="scroll-mt-6 py-14 md:py-20">
      <SectionHeader title={t.highlight} />

      <FeatureCard article={highlightFeature} />

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {highlightArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
