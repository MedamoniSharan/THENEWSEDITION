import { useContent, useHomepageArticle, useHomepageArticles } from '../content/context'
import { useLanguage } from '../i18n/language'
import ArticleCard from './ui/ArticleCard'
import FeatureCard from './ui/FeatureCard'
import SectionHeader from './ui/SectionHeader'

export default function Highlight() {
  const { t } = useLanguage()
  const { homepage } = useContent()
  const feature = useHomepageArticle(homepage.highlightFeature)
  const articles = useHomepageArticles(homepage.highlight)
  if (!feature && articles.length === 0) return null

  return (
    <section id="highlight" className="scroll-mt-6 py-14 md:py-20">
      <SectionHeader title={t.highlight} />

      {feature && <FeatureCard article={feature} />}

      {articles.length > 0 && (
        <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 ${feature ? 'mt-8' : ''}`}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}
