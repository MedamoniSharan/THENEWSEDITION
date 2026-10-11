import CtaBanner from './components/CtaBanner'
import FeaturedGrid from './components/FeaturedGrid'
import Footer from './components/Footer'
import HeroSearch from './components/HeroSearch'
import Highlight from './components/Highlight'
import LatestNews from './components/LatestNews'
import Navbar from './components/Navbar'
import PopularStory from './components/PopularStory'
import Ticker from './components/Ticker'

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className={container}>
        <Navbar />
      </div>

      <main>
        <div className={container}>
          <HeroSearch />
          <FeaturedGrid />
          <Ticker />
          <LatestNews />
        </div>

        <PopularStory />

        <div className={container}>
          <Highlight />
          <CtaBanner />
        </div>
      </main>

      <Footer />
    </div>
  )
}
