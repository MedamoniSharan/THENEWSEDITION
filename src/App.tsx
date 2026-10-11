import CategoryPage from './components/CategoryPage'
import CtaBanner from './components/CtaBanner'
import FeaturedGrid from './components/FeaturedGrid'
import Footer from './components/Footer'
import HeroSearch from './components/HeroSearch'
import IntroSplash from './components/IntroSplash'
import Highlight from './components/Highlight'
import LatestNews from './components/LatestNews'
import Navbar from './components/Navbar'
import PopularStory from './components/PopularStory'
import Testimonials from './components/Testimonials'
import Ticker from './components/Ticker'
import { useCategoryRoute } from './hooks/useCategoryRoute'

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'

export default function App() {
  const category = useCategoryRoute()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className={container}>
        <div className="pt-4">
          <Ticker />
        </div>
        <Navbar activeSlug={category?.slug} />
      </div>

      <main>
        {category ? (
          <div className={container}>
            <CategoryPage key={category.slug} category={category} />
          </div>
        ) : (
          <>
            <div className={container}>
              <HeroSearch />
              <FeaturedGrid />
              <LatestNews />
            </div>

            <PopularStory />

            <div className={container}>
              <Highlight />
            </div>

            <Testimonials />
          </>
        )}

        <div className={container}>
          <CtaBanner />
        </div>
      </main>

      <Footer />
      <IntroSplash />
    </div>
  )
}
