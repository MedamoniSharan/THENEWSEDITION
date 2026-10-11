export type Category =
  | 'Sport'
  | 'Economy'
  | 'Politics'
  | 'Technology'
  | 'Science'
  | 'Lifestyle'
  | 'World'

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
  emmaStone: { name: 'Emma Hart', avatar: img('1544005313-94ddf0286df2', 96) },
} satisfies Record<string, Author>

export const navCategories = [
  'Home',
  'Sport',
  'Economy',
  'Politics',
  'Technology',
  'Science',
  'Lifestyle',
  'World',
] as const

export const heroArticle: Article = {
  id: 'hero-album',
  title: 'Mysterious Album Teased with Midnight Countdown and Cryptic Visuals',
  excerpt:
    'A surprise drop with an enigmatic countdown has fans decoding every frame. Industry insiders hint at a genre-bending record that could redefine the season.',
  image: img('1470229722913-7c0e2dbbafd3', 1600),
  category: 'Lifestyle',
  author: authors.lilyGrace,
  date: 'Oct 11, 2026',
}

export const sideArticles: Article[] = [
  {
    id: 'side-ai-app',
    title: 'AI-Powered App Claims to Diagnose Skin Conditions with 90% Accuracy',
    excerpt:
      'Early trials suggest the tool can flag common conditions from a single photo, though dermatologists urge caution.',
    image: img('1516321318423-f06f85e504b3', 600),
    category: 'Technology',
    author: authors.sofiaLane,
    date: 'Oct 11, 2026',
  },
  {
    id: 'side-sleep-mode',
    title: 'Major Social Platform Tests "Quiet Mode" to Curb Digital Burnout',
    excerpt:
      'The opt-in feature mutes notifications and hides engagement counts for users who want a calmer feed.',
    image: img('1611162617213-7d7a39e9b1d7', 600),
    category: 'Technology',
    author: authors.marcusReed,
    date: 'Oct 10, 2026',
  },
  {
    id: 'side-climate',
    title: 'Historic Climate Pact Reached After 48-Hour Negotiation Marathon',
    excerpt:
      'Delegates from over 120 nations agreed on binding emission targets after talks stretched deep into the weekend.',
    image: img('1466611653911-95081537e5b7', 600),
    category: 'World',
    author: authors.emmaStone,
    date: 'Oct 10, 2026',
  },
]

export const tickerHeadlines: string[] = [
  'Investigators reveal how a stolen 1.2-ton statue vanished overnight',
  'Hollywood star’s lookalike contest draws thousands to the city park',
  'Pluto may be hiding an ocean, new probe data suggests',
  'Global markets rally as inflation cools for a third straight month',
  'Record-breaking heatwave prompts new urban cooling initiatives',
  'Local startup unveils battery that charges an EV in 10 minutes',
]

export const latestArticles: Article[] = [
  {
    id: 'latest-solar-flare',
    title: 'Rare Solar Flare Sparks Global Auroras and Disrupts Satellite Signals',
    excerpt:
      'Skywatchers as far south as the tropics reported vivid auroras as operators rerouted satellite traffic.',
    image: img('1614728894747-a83421e2b9c9', 600),
    category: 'Science',
    author: authors.danielCho,
    date: 'Oct 11, 2026',
  },
  {
    id: 'latest-ai-tutors',
    title: 'AI Tutors Launch in Rural Schools, Transforming Education Access',
    excerpt:
      'A pilot program brings personalised lessons to thousands of students who previously lacked specialist teachers.',
    image: img('1581091226825-a6a2a5aee158', 600),
    category: 'Technology',
    author: authors.sofiaLane,
    date: 'Oct 11, 2026',
  },
  {
    id: 'latest-ev',
    title: 'Next-Gen Electric Sedan Breaks Range Record on a Single Charge',
    excerpt:
      'The prototype covered over 1,200 km in real-world conditions, setting a new benchmark for the industry.',
    image: img('1560958089-b8a1929cea89', 600),
    category: 'Technology',
    author: authors.marcusReed,
    date: 'Oct 10, 2026',
  },
  {
    id: 'latest-markets',
    title: 'Markets Rally as Central Banks Signal a Pause on Rate Hikes',
    excerpt:
      'Equities posted their best week in months as investors welcomed softer guidance from policymakers.',
    image: img('1611974789855-9c2a0a7236a3', 600),
    category: 'Economy',
    author: authors.emmaStone,
    date: 'Oct 10, 2026',
  },
  {
    id: 'latest-galaxy',
    title: 'Telescope Captures Sharpest-Ever Image of a Distant Spiral Galaxy',
    excerpt:
      'Astronomers say the detail reveals star-forming regions never seen before at this distance.',
    image: img('1462331940025-496dfbfc7564', 600),
    category: 'Science',
    author: authors.danielCho,
    date: 'Oct 9, 2026',
  },
]

export const popularFeature: Article = {
  id: 'popular-station',
  title: 'Construction Begins on International Space Agencies’ New Orbital Station',
  excerpt:
    'In a landmark collaboration, five space agencies have started assembling the first modules of a next-generation orbital outpost. The station is designed to host research crews year-round and serve as a staging point for deep-space missions later this decade.',
  image: img('1446776811953-b23d57bd21aa', 1400),
  category: 'Science',
  author: authors.marcusReed,
  date: 'Oct 11, 2026',
}

export const popularArticles: Article[] = [
  {
    id: 'popular-smart-cities',
    title: 'Ten Smart Cities Go Fully Digital to Improve Urban Life',
    excerpt: 'Connected infrastructure is cutting commute times and energy use.',
    image: img('1477959858617-67f85cf4f1df', 400),
    category: 'Technology',
    author: authors.sofiaLane,
    date: 'Oct 10, 2026',
  },
  {
    id: 'popular-vertical-farms',
    title: 'Vertical Farms Bring Fresh Produce to Remote Regions',
    excerpt: 'Stacked hydroponic towers are feeding communities year-round.',
    image: img('1530836369250-ef72a3f5cda8', 400),
    category: 'Science',
    author: authors.danielCho,
    date: 'Oct 10, 2026',
  },
  {
    id: 'popular-vr-history',
    title: 'Virtual Reality History Lessons Engage Students in New Ways',
    excerpt: 'Classrooms are stepping inside ancient cities through VR headsets.',
    image: img('1535223289827-42f1e9919769', 400),
    category: 'Lifestyle',
    author: authors.lilyGrace,
    date: 'Oct 9, 2026',
  },
]

export const highlightFeature: Article = {
  id: 'highlight-smart-clothing',
  title: 'Smart Clothing Tracks Health Stats and Sends Alerts to Users in Real Time',
  excerpt:
    'New wearable technology woven directly into fabric can monitor heart rate, hydration and posture, sending alerts to a paired phone when something looks off. Designers say the garments feel no different from everyday clothing and survive hundreds of washes.',
  image: img('1441986300917-64674bd600d8', 1800),
  category: 'Technology',
  author: authors.lilyGrace,
  date: 'Oct 11, 2026',
}

export const highlightArticles: Article[] = [
  {
    id: 'highlight-solar',
    title: 'Global Solar Power Output Hits New Record, Surpassing Forecasts',
    excerpt:
      'Solar generation grew faster than any other energy source this year, driven by falling panel costs.',
    image: img('1509391366360-2e959784a276', 600),
    category: 'Economy',
    author: authors.emmaStone,
    date: 'Oct 11, 2026',
  },
  {
    id: 'highlight-concrete',
    title: 'Self-Healing Concrete Developed to Extend the Life of Infrastructure Projects',
    excerpt:
      'Bacteria embedded in the mix seal cracks automatically, potentially saving billions in repairs.',
    image: img('1503387762-592deb58ef4e', 600),
    category: 'Science',
    author: authors.danielCho,
    date: 'Oct 10, 2026',
  },
  {
    id: 'highlight-hospitals',
    title: 'Smart Hospitals Use AI to Predict Patient Needs and Prevent Emergencies',
    excerpt:
      'Predictive monitoring is helping nurses respond to warning signs hours before a crisis.',
    image: img('1519494026892-80bbd2d6fd0d', 600),
    category: 'Technology',
    author: authors.sofiaLane,
    date: 'Oct 10, 2026',
  },
  {
    id: 'highlight-ev-stations',
    title: 'Electric Cars Outnumber Gas-Powered Vehicles in Major City Center',
    excerpt:
      'A decade of incentives and charging investment has reshaped downtown traffic for good.',
    image: img('1593941707882-a5bba14938c7', 600),
    category: 'World',
    author: authors.marcusReed,
    date: 'Oct 9, 2026',
  },
]
