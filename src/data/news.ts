export const categories = [
  {
    name: 'Political News',
    slug: 'political-news',
    description: 'Elections, governance and policy decisions shaping the nation.',
  },
  {
    name: 'Devotional',
    slug: 'devotional',
    description: 'Temple festivals, pilgrimages and spiritual events from across the country.',
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Schools, exams, results and the future of learning.',
  },
  {
    name: 'Health',
    slug: 'health',
    description: 'Medical breakthroughs, wellness tips and public health updates.',
  },
  {
    name: 'Crime',
    slug: 'crime',
    description: 'Investigations, arrests and court verdicts.',
  },
  {
    name: 'Cinema',
    slug: 'cinema',
    description: 'New releases, box office reports and stories from the film industry.',
  },
  {
    name: 'Others',
    slug: 'others',
    description: 'Science, technology, environment and everything else worth knowing.',
  },
] as const

export type CategoryInfo = (typeof categories)[number]
export type Category = CategoryInfo['name']
export type CategorySlug = CategoryInfo['slug']

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)
export const slugOf = (name: Category) => categories.find((c) => c.name === name)!.slug

export interface Author {
  name: string
  avatar: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  image: string
  category: Category
  author: Author
  date: string
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const authors = {
  lilyGrace: { name: 'Lily Grace', avatar: img('1494790108377-be9c29b29330', 96) },
  marcusReed: { name: 'Marcus Reed', avatar: img('1500648767791-00dcc994a43e', 96) },
  sofiaLane: { name: 'Sofia Lane', avatar: img('1438761681033-6461ffad8d80', 96) },
  danielCho: { name: 'Daniel Cho', avatar: img('1472099645785-5658abf4ff4e', 96) },
  emmaHart: { name: 'Emma Hart', avatar: img('1544005313-94ddf0286df2', 96) },
} satisfies Record<string, Author>

export const heroArticle: Article = {
  id: 'cinema-epic-teaser',
  title: 'Superstar’s Pan-India Epic Teased with Midnight Countdown and Cryptic Posters',
  excerpt:
    'A surprise countdown and a string of mysterious posters have fans decoding every frame. Insiders say the big-budget film will release in five languages this Sankranti.',
  image: img('1470229722913-7c0e2dbbafd3', 1600),
  category: 'Cinema',
  author: authors.lilyGrace,
  date: 'Oct 11, 2026',
}

export const sideArticles: Article[] = [
  {
    id: 'political-assembly-bill',
    title: 'Assembly Passes Landmark Bill After 14-Hour Marathon Debate',
    excerpt:
      'The new law promises faster approvals for public projects, though opposition members walked out before the final vote.',
    image: img('1529107386315-e1a2ed48a620', 600),
    category: 'Political News',
    author: authors.marcusReed,
    date: 'Oct 11, 2026',
  },
  {
    id: 'health-skin-app',
    title: 'AI-Powered App Claims to Diagnose Skin Conditions with 90% Accuracy',
    excerpt:
      'Early trials suggest the tool can flag common conditions from a single photo, though dermatologists urge caution.',
    image: img('1516321318423-f06f85e504b3', 600),
    category: 'Health',
    author: authors.sofiaLane,
    date: 'Oct 11, 2026',
  },
  {
    id: 'devotional-brahmotsavam',
    title: 'Lakhs of Devotees Throng Temple Town as Annual Brahmotsavam Begins',
    excerpt:
      'Special darshan queues, free meals and extra buses have been arranged for the nine-day festival.',
    image: img('1582510003544-4d00b7f74220', 600),
    category: 'Devotional',
    author: authors.emmaHart,
    date: 'Oct 10, 2026',
  },
]

export const tickerHeadlines: string[] = [
  'Election Commission to announce local body poll dates this week',
  'Temple trust launches online booking for festival darshan',
  'Board exam timetable released; exams to begin in March',
  'Health department starts free screening camps in 200 villages',
  'Police crack interstate vehicle theft gang, 12 arrested',
  'Much-awaited sequel crosses ₹100 crore on opening weekend',
]

export const latestArticles: Article[] = [
  {
    id: 'crime-cyber-fraud',
    title: 'Cyber Police Bust Investment Fraud Ring That Duped 2,000 People',
    excerpt:
      'Investigators traced the gang through fake trading apps and froze accounts holding over ₹40 crore.',
    image: img('1453873531674-2151bcd01707', 600),
    category: 'Crime',
    author: authors.danielCho,
    date: 'Oct 11, 2026',
  },
  {
    id: 'education-ai-tutors',
    title: 'AI Tutors Launch in Rural Schools, Transforming Education Access',
    excerpt:
      'A pilot program brings personalised lessons to thousands of students who previously lacked specialist teachers.',
    image: img('1509062522246-3755977927d7', 600),
    category: 'Education',
    author: authors.sofiaLane,
    date: 'Oct 11, 2026',
  },
  {
    id: 'cinema-box-office',
    title: 'Box Office: Festive Weekend Collections Cross ₹200 Crore Mark',
    excerpt:
      'Packed theatres across the country made it the biggest weekend of the year for the film industry.',
    image: img('1517604931442-7e0c8ed2963c', 600),
    category: 'Cinema',
    author: authors.lilyGrace,
    date: 'Oct 10, 2026',
  },
  {
    id: 'political-poll-schedule',
    title: 'Election Commission Announces Schedule for Local Body Polls',
    excerpt:
      'Voting will be held in three phases, with counting scheduled for the first week of next month.',
    image: img('1540910419892-4a36d2c3266c', 600),
    category: 'Political News',
    author: authors.marcusReed,
    date: 'Oct 10, 2026',
  },
  {
    id: 'others-solar-flare',
    title: 'Rare Solar Flare Sparks Global Auroras and Disrupts Satellite Signals',
    excerpt:
      'Skywatchers as far south as the tropics reported vivid auroras as operators rerouted satellite traffic.',
    image: img('1614728894747-a83421e2b9c9', 600),
    category: 'Others',
    author: authors.danielCho,
    date: 'Oct 9, 2026',
  },
]

export const popularFeature: Article = {
  id: 'others-orbital-station',
  title: 'Construction Begins on International Space Agencies’ New Orbital Station',
  excerpt:
    'In a landmark collaboration, five space agencies have started assembling the first modules of a next-generation orbital outpost. The station is designed to host research crews year-round and serve as a staging point for deep-space missions later this decade.',
  image: img('1446776811953-b23d57bd21aa', 1400),
  category: 'Others',
  author: authors.marcusReed,
  date: 'Oct 11, 2026',
}

export const popularArticles: Article[] = [
  {
    id: 'devotional-ganga-aarti',
    title: 'Varanasi Ghats Glow as Thousands Gather for Evening Ganga Aarti',
    excerpt: 'Pilgrims and tourists lined the river steps for the festival-season ceremony.',
    image: img('1561361058-c24cecae35ca', 400),
    category: 'Devotional',
    author: authors.emmaHart,
    date: 'Oct 10, 2026',
  },
  {
    id: 'health-daily-walks',
    title: 'Doctors Urge Daily Walks as Lifestyle Diseases Rise Among Young Adults',
    excerpt: 'Just 30 minutes a day can sharply cut the risk of diabetes and heart disease.',
    image: img('1571019613454-1cb2f99b2d8b', 400),
    category: 'Health',
    author: authors.sofiaLane,
    date: 'Oct 10, 2026',
  },
  {
    id: 'crime-chain-snatching-verdict',
    title: 'Court Sentences Gang Leader to Life in Chain-Snatching Case',
    excerpt: 'The verdict comes two years after a city-wide crackdown on street crime.',
    image: img('1593115057322-e94b77572f20', 400),
    category: 'Crime',
    author: authors.danielCho,
    date: 'Oct 9, 2026',
  },
]

export const highlightFeature: Article = {
  id: 'education-digital-classrooms',
  title: 'State Rolls Out Free Digital Classrooms and Libraries in 5,000 Government Schools',
  excerpt:
    'Every participating school will get smart boards, a digital library and trained staff by the next academic year. Officials say the programme aims to close the learning gap between city and village schools.',
  image: img('1427504494785-3a9ca7044f45', 1800),
  category: 'Education',
  author: authors.lilyGrace,
  date: 'Oct 11, 2026',
}

export const highlightArticles: Article[] = [
  {
    id: 'health-smart-hospitals',
    title: 'Smart Hospitals Use AI to Predict Patient Needs and Prevent Emergencies',
    excerpt:
      'Predictive monitoring is helping nurses respond to warning signs hours before a crisis.',
    image: img('1519494026892-80bbd2d6fd0d', 600),
    category: 'Health',
    author: authors.sofiaLane,
    date: 'Oct 10, 2026',
  },
  {
    id: 'political-opposition-meet',
    title: 'Opposition Leaders Meet to Chart Joint Strategy Ahead of Polls',
    excerpt:
      'Leaders from six parties agreed to field common candidates in key constituencies.',
    image: img('1555848962-6e79363ec58f', 600),
    category: 'Political News',
    author: authors.marcusReed,
    date: 'Oct 10, 2026',
  },
  {
    id: 'crime-temple-idols',
    title: 'Police Recover Stolen Temple Idols Worth Crores in Interstate Raid',
    excerpt:
      'The antique bronze idols, missing for over a decade, will be returned to their temples.',
    image: img('1589829545856-d10d557cf95f', 600),
    category: 'Crime',
    author: authors.danielCho,
    date: 'Oct 9, 2026',
  },
  {
    id: 'cinema-director-comeback',
    title: 'Veteran Director Announces Comeback Film with an All-Star Cast',
    excerpt:
      'Shooting begins next month, with the film slated for a summer release.',
    image: img('1485846234645-a62644f84728', 600),
    category: 'Cinema',
    author: authors.lilyGrace,
    date: 'Oct 9, 2026',
  },
]

/** Stories that only appear on category pages. */
const moreArticles: Article[] = [
  {
    id: 'political-turnout-record',
    title: 'Voter Turnout Hits Record High in By-Election',
    excerpt: 'Nearly 78% of registered voters cast their ballots, the highest in two decades.',
    image: img('1494172961521-33799ddd43a5', 600),
    category: 'Political News',
    author: authors.marcusReed,
    date: 'Oct 8, 2026',
  },
  {
    id: 'devotional-golden-temple-langar',
    title: 'Golden Temple Langar Serves a Record Number of Visitors During Festival',
    excerpt: 'Volunteers prepared meals around the clock for more than two lakh devotees a day.',
    image: img('1609947017136-9daf32a5eb16', 600),
    category: 'Devotional',
    author: authors.emmaHart,
    date: 'Oct 8, 2026',
  },
  {
    id: 'devotional-mosque-restoration',
    title: 'Historic Mosque Restoration Completed Ahead of Festival Prayers',
    excerpt: 'Craftsmen spent three years restoring the domes, minarets and original tilework.',
    image: img('1519817650390-64a93db51149', 600),
    category: 'Devotional',
    author: authors.sofiaLane,
    date: 'Oct 7, 2026',
  },
  {
    id: 'education-board-results',
    title: 'Board Exam Results Announced; Pass Percentage Rises to 92%',
    excerpt: 'Girls outperformed boys for the fifth year in a row, officials said.',
    image: img('1503676260728-1c00da094a0b', 600),
    category: 'Education',
    author: authors.lilyGrace,
    date: 'Oct 8, 2026',
  },
  {
    id: 'education-libraries-24x7',
    title: 'University Libraries to Stay Open 24/7 During Exam Season',
    excerpt: 'Students welcomed the move, which also includes free late-night shuttle buses.',
    image: img('1497633762265-9d179a990aa6', 600),
    category: 'Education',
    author: authors.danielCho,
    date: 'Oct 7, 2026',
  },
  {
    id: 'health-regional-diets',
    title: 'Nutritionists Recommend Regional Diets for Better Heart Health',
    excerpt: 'Traditional meals rich in millets and vegetables beat many modern diet trends.',
    image: img('1490645935967-10de6ba17061', 600),
    category: 'Health',
    author: authors.emmaHart,
    date: 'Oct 8, 2026',
  },
  {
    id: 'crime-cyber-helpline',
    title: 'New Cybercrime Helpline Resolves 10,000 Complaints in First Month',
    excerpt: 'Most cases involved online shopping scams and fake job offers.',
    image: img('1450101499163-c8848c66ca85', 600),
    category: 'Crime',
    author: authors.marcusReed,
    date: 'Oct 8, 2026',
  },
  {
    id: 'cinema-single-screens',
    title: 'Single-Screen Theatres Make a Comeback with Retro Film Festivals',
    excerpt: 'Classic re-releases are drawing packed houses to old neighbourhood cinemas.',
    image: img('1536440136628-849c177e76a1', 600),
    category: 'Cinema',
    author: authors.lilyGrace,
    date: 'Oct 8, 2026',
  },
  {
    id: 'others-solar-record',
    title: 'Global Solar Power Output Hits New Record, Surpassing Forecasts',
    excerpt: 'Solar generation grew faster than any other energy source this year.',
    image: img('1509391366360-2e959784a276', 600),
    category: 'Others',
    author: authors.emmaHart,
    date: 'Oct 8, 2026',
  },
  {
    id: 'others-ev-city',
    title: 'Electric Cars Outnumber Petrol Vehicles in Major City Centre',
    excerpt: 'A decade of incentives and charging investment has reshaped downtown traffic.',
    image: img('1593941707882-a5bba14938c7', 600),
    category: 'Others',
    author: authors.marcusReed,
    date: 'Oct 7, 2026',
  },
]

export const allArticles: Article[] = [
  heroArticle,
  ...sideArticles,
  ...latestArticles,
  popularFeature,
  ...popularArticles,
  highlightFeature,
  ...highlightArticles,
  ...moreArticles,
]

export const articlesInCategory = (category: Category) =>
  allArticles.filter((a) => a.category === category)
