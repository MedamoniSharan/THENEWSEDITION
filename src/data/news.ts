import type { Localized } from '../i18n/types'

export const categories = [
  {
    slug: 'political-news',
    name: { en: 'Political News', te: 'రాజకీయ వార్తలు' },
    description: {
      en: 'Elections, governance and policy decisions shaping the nation.',
      te: 'దేశ భవిష్యత్తును మలిచే ఎన్నికలు, పాలన, విధాన నిర్ణయాలు.',
    },
  },
  {
    slug: 'devotional',
    name: { en: 'Devotional', te: 'భక్తి' },
    description: {
      en: 'Temple festivals, pilgrimages and spiritual events from across the country.',
      te: 'దేశవ్యాప్తంగా ఆలయ ఉత్సవాలు, తీర్థయాత్రలు, ఆధ్యాత్మిక కార్యక్రమాలు.',
    },
  },
  {
    slug: 'education',
    name: { en: 'Education', te: 'విద్య' },
    description: {
      en: 'Schools, exams, results and the future of learning.',
      te: 'పాఠశాలలు, పరీక్షలు, ఫలితాలు, చదువుల భవిష్యత్తు.',
    },
  },
  {
    slug: 'health',
    name: { en: 'Health', te: 'ఆరోగ్యం' },
    description: {
      en: 'Medical breakthroughs, wellness tips and public health updates.',
      te: 'వైద్య రంగ పురోగతులు, ఆరోగ్య చిట్కాలు, ప్రజారోగ్య సమాచారం.',
    },
  },
  {
    slug: 'crime',
    name: { en: 'Crime', te: 'నేరాలు' },
    description: {
      en: 'Investigations, arrests and court verdicts.',
      te: 'దర్యాప్తులు, అరెస్టులు, కోర్టు తీర్పులు.',
    },
  },
  {
    slug: 'cinema',
    name: { en: 'Cinema', te: 'సినిమా' },
    description: {
      en: 'New releases, box office reports and stories from the film industry.',
      te: 'కొత్త విడుదలలు, బాక్సాఫీస్ రిపోర్టులు, సినీ పరిశ్రమ కథనాలు.',
    },
  },
  {
    slug: 'others',
    name: { en: 'Others', te: 'ఇతరాలు' },
    description: {
      en: 'Science, technology, environment and everything else worth knowing.',
      te: 'సైన్స్, టెక్నాలజీ, పర్యావరణం మరియు తెలుసుకోదగిన ప్రతిదీ.',
    },
  },
] as const satisfies readonly { slug: string; name: Localized; description: Localized }[]

export type CategoryInfo = (typeof categories)[number]
export type CategorySlug = CategoryInfo['slug']

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)

export interface Author {
  name: Localized
}

export interface Article {
  id: string
  title: Localized
  excerpt: Localized
  image: string
  category: CategorySlug
  author: Author
  /** ISO date, formatted per language when shown. */
  date: string
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const authors = {
  lilyGrace: { name: { en: 'Lily Grace', te: 'లిల్లీ గ్రేస్' } },
  marcusReed: { name: { en: 'Marcus Reed', te: 'మార్కస్ రీడ్' } },
  sofiaLane: { name: { en: 'Sofia Lane', te: 'సోఫియా లేన్' } },
  danielCho: { name: { en: 'Daniel Cho', te: 'డేనియల్ చో' } },
  emmaHart: { name: { en: 'Emma Hart', te: 'ఎమ్మా హార్ట్' } },
} satisfies Record<string, Author>

export const heroArticle: Article = {
  id: 'cinema-epic-teaser',
  title: {
    en: 'Superstar’s Pan-India Epic Teased with Midnight Countdown and Cryptic Posters',
    te: 'అర్ధరాత్రి కౌంట్‌డౌన్, రహస్య పోస్టర్లతో సూపర్‌స్టార్ పాన్-ఇండియా చిత్రంపై ఉత్కంఠ',
  },
  excerpt: {
    en: 'A surprise countdown and a string of mysterious posters have fans decoding every frame. Insiders say the big-budget film will release in five languages this Sankranti.',
    te: 'అనూహ్య కౌంట్‌డౌన్, వరుస రహస్య పోస్టర్లతో అభిమానులు ప్రతి ఫ్రేమ్‌నూ విశ్లేషిస్తున్నారు. ఈ భారీ బడ్జెట్ చిత్రం సంక్రాంతికి ఐదు భాషల్లో విడుదల కానుందని సమాచారం.',
  },
  image: img('1470229722913-7c0e2dbbafd3', 1600),
  category: 'cinema',
  author: authors.lilyGrace,
  date: '2026-10-11',
}

export const sideArticles: Article[] = [
  {
    id: 'political-assembly-bill',
    title: {
      en: 'Assembly Passes Landmark Bill After 14-Hour Marathon Debate',
      te: '14 గంటల సుదీర్ఘ చర్చ అనంతరం అసెంబ్లీలో చారిత్రక బిల్లుకు ఆమోదం',
    },
    excerpt: {
      en: 'The new law promises faster approvals for public projects, though opposition members walked out before the final vote.',
      te: 'కొత్త చట్టంతో ప్రజా ప్రాజెక్టులకు అనుమతులు వేగంగా లభిస్తాయి; అయితే తుది ఓటింగ్‌కు ముందే ప్రతిపక్ష సభ్యులు వాకౌట్ చేశారు.',
    },
    image: img('1529107386315-e1a2ed48a620', 600),
    category: 'political-news',
    author: authors.marcusReed,
    date: '2026-10-11',
  },
  {
    id: 'health-skin-app',
    title: {
      en: 'AI-Powered App Claims to Diagnose Skin Conditions with 90% Accuracy',
      te: 'చర్మ వ్యాధులను 90% కచ్చితత్వంతో గుర్తిస్తుందంటున్న AI యాప్',
    },
    excerpt: {
      en: 'Early trials suggest the tool can flag common conditions from a single photo, though dermatologists urge caution.',
      te: 'ఒక్క ఫోటోతోనే సాధారణ చర్మ సమస్యలను ఈ యాప్ గుర్తించగలదని ప్రాథమిక పరీక్షలు చెబుతున్నాయి; అయితే జాగ్రత్త అవసరమని చర్మవైద్యులు సూచిస్తున్నారు.',
    },
    image: img('1516321318423-f06f85e504b3', 600),
    category: 'health',
    author: authors.sofiaLane,
    date: '2026-10-11',
  },
  {
    id: 'devotional-brahmotsavam',
    title: {
      en: 'Lakhs of Devotees Throng Temple Town as Annual Brahmotsavam Begins',
      te: 'వార్షిక బ్రహ్మోత్సవాలు ప్రారంభం; ఆలయ పట్టణానికి పోటెత్తిన లక్షలాది భక్తులు',
    },
    excerpt: {
      en: 'Special darshan queues, free meals and extra buses have been arranged for the nine-day festival.',
      te: 'తొమ్మిది రోజుల ఉత్సవాల కోసం ప్రత్యేక దర్శన క్యూలు, ఉచిత అన్నప్రసాదం, అదనపు బస్సులు ఏర్పాటు చేశారు.',
    },
    image: img('1582510003544-4d00b7f74220', 600),
    category: 'devotional',
    author: authors.emmaHart,
    date: '2026-10-10',
  },
]

export const tickerHeadlines: Localized[] = [
  {
    en: 'Election Commission to announce local body poll dates this week',
    te: 'ఈ వారంలోనే స్థానిక సంస్థల ఎన్నికల తేదీలు ప్రకటించనున్న ఎన్నికల సంఘం',
  },
  {
    en: 'Temple trust launches online booking for festival darshan',
    te: 'ఉత్సవ దర్శనానికి ఆన్‌లైన్ బుకింగ్ ప్రారంభించిన ఆలయ ట్రస్ట్',
  },
  {
    en: 'Board exam timetable released; exams to begin in March',
    te: 'బోర్డు పరీక్షల టైమ్‌టేబుల్ విడుదల; మార్చిలో పరీక్షలు ప్రారంభం',
  },
  {
    en: 'Health department starts free screening camps in 200 villages',
    te: '200 గ్రామాల్లో ఉచిత వైద్య పరీక్షల శిబిరాలు ప్రారంభించిన ఆరోగ్య శాఖ',
  },
  {
    en: 'Police crack interstate vehicle theft gang, 12 arrested',
    te: 'అంతర్రాష్ట్ర వాహన దొంగల ముఠా గుట్టురట్టు, 12 మంది అరెస్ట్',
  },
  {
    en: 'Much-awaited sequel crosses ₹100 crore on opening weekend',
    te: 'ఓపెనింగ్ వీకెండ్‌లోనే ₹100 కోట్లు దాటిన భారీ సీక్వెల్',
  },
]

export const latestArticles: Article[] = [
  {
    id: 'crime-cyber-fraud',
    title: {
      en: 'Cyber Police Bust Investment Fraud Ring That Duped 2,000 People',
      te: '2,000 మందిని మోసగించిన పెట్టుబడి మోసాల ముఠాను పట్టుకున్న సైబర్ పోలీసులు',
    },
    excerpt: {
      en: 'Investigators traced the gang through fake trading apps and froze accounts holding over ₹40 crore.',
      te: 'నకిలీ ట్రేడింగ్ యాప్‌ల ద్వారా ముఠాను గుర్తించిన అధికారులు ₹40 కోట్లకు పైగా ఉన్న ఖాతాలను స్తంభింపజేశారు.',
    },
    image: img('1453873531674-2151bcd01707', 600),
    category: 'crime',
    author: authors.danielCho,
    date: '2026-10-11',
  },
  {
    id: 'education-ai-tutors',
    title: {
      en: 'AI Tutors Launch in Rural Schools, Transforming Education Access',
      te: 'గ్రామీణ పాఠశాలల్లో AI ట్యూటర్లు; చదువుకు కొత్త దారులు',
    },
    excerpt: {
      en: 'A pilot program brings personalised lessons to thousands of students who previously lacked specialist teachers.',
      te: 'ఇప్పటివరకు ప్రత్యేక ఉపాధ్యాయులు లేని వేలాది మంది విద్యార్థులకు ఈ పైలట్ ప్రాజెక్ట్ వ్యక్తిగత పాఠాలు అందిస్తోంది.',
    },
    image: img('1509062522246-3755977927d7', 600),
    category: 'education',
    author: authors.sofiaLane,
    date: '2026-10-11',
  },
  {
    id: 'cinema-box-office',
    title: {
      en: 'Box Office: Festive Weekend Collections Cross ₹200 Crore Mark',
      te: 'బాక్సాఫీస్: పండుగ వీకెండ్ వసూళ్లు ₹200 కోట్లు దాటాయి',
    },
    excerpt: {
      en: 'Packed theatres across the country made it the biggest weekend of the year for the film industry.',
      te: 'దేశవ్యాప్తంగా కిక్కిరిసిన థియేటర్లతో సినీ పరిశ్రమకు ఇది ఈ ఏడాదిలోనే అతిపెద్ద వీకెండ్‌గా నిలిచింది.',
    },
    image: img('1517604931442-7e0c8ed2963c', 600),
    category: 'cinema',
    author: authors.lilyGrace,
    date: '2026-10-10',
  },
  {
    id: 'political-poll-schedule',
    title: {
      en: 'Election Commission Announces Schedule for Local Body Polls',
      te: 'స్థానిక సంస్థల ఎన్నికల షెడ్యూల్ ప్రకటించిన ఎన్నికల సంఘం',
    },
    excerpt: {
      en: 'Voting will be held in three phases, with counting scheduled for the first week of next month.',
      te: 'మూడు దశల్లో పోలింగ్ జరగనుండగా, వచ్చే నెల మొదటి వారంలో ఓట్ల లెక్కింపు ఉంటుంది.',
    },
    image: img('1540910419892-4a36d2c3266c', 600),
    category: 'political-news',
    author: authors.marcusReed,
    date: '2026-10-10',
  },
  {
    id: 'others-solar-flare',
    title: {
      en: 'Rare Solar Flare Sparks Global Auroras and Disrupts Satellite Signals',
      te: 'అరుదైన సౌర జ్వాలతో ప్రపంచవ్యాప్తంగా ధ్రువకాంతులు; ఉపగ్రహ సిగ్నళ్లకు అంతరాయం',
    },
    excerpt: {
      en: 'Skywatchers as far south as the tropics reported vivid auroras as operators rerouted satellite traffic.',
      te: 'ఉష్ణమండల ప్రాంతాల వరకు ఆకాశంలో రంగురంగుల ధ్రువకాంతులు కనిపించగా, ఆపరేటర్లు ఉపగ్రహ ట్రాఫిక్‌ను దారి మళ్లించారు.',
    },
    image: img('1614728894747-a83421e2b9c9', 600),
    category: 'others',
    author: authors.danielCho,
    date: '2026-10-09',
  },
]

export const popularFeature: Article = {
  id: 'others-orbital-station',
  title: {
    en: 'Construction Begins on International Space Agencies’ New Orbital Station',
    te: 'అంతర్జాతీయ అంతరిక్ష సంస్థల కొత్త కక్ష్య కేంద్రం నిర్మాణం ప్రారంభం',
  },
  excerpt: {
    en: 'In a landmark collaboration, five space agencies have started assembling the first modules of a next-generation orbital outpost. The station is designed to host research crews year-round and serve as a staging point for deep-space missions later this decade.',
    te: 'చారిత్రక సహకారంలో భాగంగా ఐదు అంతరిక్ష సంస్థలు తదుపరి తరం కక్ష్య కేంద్రం తొలి మాడ్యూళ్లను అమర్చడం ప్రారంభించాయి. ఏడాది పొడవునా పరిశోధక బృందాలకు ఆతిథ్యం ఇచ్చేలా, ఈ దశాబ్దం చివర్లో చేపట్టే సుదూర అంతరిక్ష యాత్రలకు కేంద్రంగా ఉండేలా దీన్ని రూపొందించారు.',
  },
  image: img('1446776811953-b23d57bd21aa', 1400),
  category: 'others',
  author: authors.marcusReed,
  date: '2026-10-11',
}

export const popularArticles: Article[] = [
  {
    id: 'devotional-ganga-aarti',
    title: {
      en: 'Varanasi Ghats Glow as Thousands Gather for Evening Ganga Aarti',
      te: 'సాయంత్రం గంగా హారతికి వేలాదిగా భక్తులు; దీపకాంతుల్లో వారణాసి ఘాట్లు',
    },
    excerpt: {
      en: 'Pilgrims and tourists lined the river steps for the festival-season ceremony.',
      te: 'పండుగ సీజన్ హారతి కోసం యాత్రికులు, పర్యాటకులు నదీ మెట్లపై బారులు తీరారు.',
    },
    image: img('1561361058-c24cecae35ca', 400),
    category: 'devotional',
    author: authors.emmaHart,
    date: '2026-10-10',
  },
  {
    id: 'health-daily-walks',
    title: {
      en: 'Doctors Urge Daily Walks as Lifestyle Diseases Rise Among Young Adults',
      te: 'యువతలో పెరుగుతున్న జీవనశైలి వ్యాధులు; రోజూ నడక తప్పనిసరి అంటున్న వైద్యులు',
    },
    excerpt: {
      en: 'Just 30 minutes a day can sharply cut the risk of diabetes and heart disease.',
      te: 'రోజుకు కేవలం 30 నిమిషాల నడకతో మధుమేహం, గుండె జబ్బుల ముప్పు గణనీయంగా తగ్గుతుంది.',
    },
    image: img('1571019613454-1cb2f99b2d8b', 400),
    category: 'health',
    author: authors.sofiaLane,
    date: '2026-10-10',
  },
  {
    id: 'crime-chain-snatching-verdict',
    title: {
      en: 'Court Sentences Gang Leader to Life in Chain-Snatching Case',
      te: 'చైన్ స్నాచింగ్ కేసులో ముఠా నాయకుడికి జీవిత ఖైదు విధించిన కోర్టు',
    },
    excerpt: {
      en: 'The verdict comes two years after a city-wide crackdown on street crime.',
      te: 'నగరవ్యాప్తంగా వీధి నేరాలపై ఉక్కుపాదం మోపిన రెండేళ్ల తర్వాత ఈ తీర్పు వెలువడింది.',
    },
    image: img('1593115057322-e94b77572f20', 400),
    category: 'crime',
    author: authors.danielCho,
    date: '2026-10-09',
  },
]

export const highlightFeature: Article = {
  id: 'education-digital-classrooms',
  title: {
    en: 'State Rolls Out Free Digital Classrooms and Libraries in 5,000 Government Schools',
    te: '5,000 ప్రభుత్వ పాఠశాలల్లో ఉచిత డిజిటల్ తరగతి గదులు, గ్రంథాలయాలు ప్రారంభించిన రాష్ట్రం',
  },
  excerpt: {
    en: 'Every participating school will get smart boards, a digital library and trained staff by the next academic year. Officials say the programme aims to close the learning gap between city and village schools.',
    te: 'వచ్చే విద్యా సంవత్సరం నాటికి ప్రతి పాఠశాలకు స్మార్ట్ బోర్డులు, డిజిటల్ లైబ్రరీ, శిక్షణ పొందిన సిబ్బంది అందుతారు. పట్టణ, గ్రామీణ పాఠశాలల మధ్య చదువుల అంతరాన్ని తగ్గించడమే ఈ కార్యక్రమ లక్ష్యమని అధికారులు తెలిపారు.',
  },
  image: img('1427504494785-3a9ca7044f45', 1800),
  category: 'education',
  author: authors.lilyGrace,
  date: '2026-10-11',
}

export const highlightArticles: Article[] = [
  {
    id: 'health-smart-hospitals',
    title: {
      en: 'Smart Hospitals Use AI to Predict Patient Needs and Prevent Emergencies',
      te: 'AI సాయంతో రోగుల అవసరాలను ముందే అంచనా వేస్తున్న స్మార్ట్ ఆసుపత్రులు',
    },
    excerpt: {
      en: 'Predictive monitoring is helping nurses respond to warning signs hours before a crisis.',
      te: 'ప్రమాద సంకేతాలను గంటల ముందే గుర్తించి నర్సులు స్పందించేందుకు ప్రిడిక్టివ్ మానిటరింగ్ దోహదపడుతోంది.',
    },
    image: img('1519494026892-80bbd2d6fd0d', 600),
    category: 'health',
    author: authors.sofiaLane,
    date: '2026-10-10',
  },
  {
    id: 'political-opposition-meet',
    title: {
      en: 'Opposition Leaders Meet to Chart Joint Strategy Ahead of Polls',
      te: 'ఎన్నికల ముందు ఉమ్మడి వ్యూహంపై ప్రతిపక్ష నేతల భేటీ',
    },
    excerpt: {
      en: 'Leaders from six parties agreed to field common candidates in key constituencies.',
      te: 'కీలక నియోజకవర్గాల్లో ఉమ్మడి అభ్యర్థులను నిలబెట్టేందుకు ఆరు పార్టీల నేతలు అంగీకరించారు.',
    },
    image: img('1555848962-6e79363ec58f', 600),
    category: 'political-news',
    author: authors.marcusReed,
    date: '2026-10-10',
  },
  {
    id: 'crime-temple-idols',
    title: {
      en: 'Police Recover Stolen Temple Idols Worth Crores in Interstate Raid',
      te: 'అంతర్రాష్ట్ర దాడుల్లో కోట్ల విలువైన చోరీ ఆలయ విగ్రహాలు స్వాధీనం',
    },
    excerpt: {
      en: 'The antique bronze idols, missing for over a decade, will be returned to their temples.',
      te: 'దశాబ్దానికి పైగా కనిపించకుండా పోయిన పురాతన కంచు విగ్రహాలను తిరిగి ఆయా ఆలయాలకు అప్పగించనున్నారు.',
    },
    image: img('1589829545856-d10d557cf95f', 600),
    category: 'crime',
    author: authors.danielCho,
    date: '2026-10-09',
  },
  {
    id: 'cinema-director-comeback',
    title: {
      en: 'Veteran Director Announces Comeback Film with an All-Star Cast',
      te: 'భారీ తారాగణంతో సీనియర్ దర్శకుడి రీఎంట్రీ చిత్రం ప్రకటన',
    },
    excerpt: {
      en: 'Shooting begins next month, with the film slated for a summer release.',
      te: 'వచ్చే నెలలో షూటింగ్ ప్రారంభం కానుండగా, వేసవిలో సినిమా విడుదల కానుంది.',
    },
    image: img('1485846234645-a62644f84728', 600),
    category: 'cinema',
    author: authors.lilyGrace,
    date: '2026-10-09',
  },
]

/** Stories that only appear on category pages. */
const moreArticles: Article[] = [
  {
    id: 'political-turnout-record',
    title: {
      en: 'Voter Turnout Hits Record High in By-Election',
      te: 'ఉప ఎన్నికలో రికార్డు స్థాయి పోలింగ్',
    },
    excerpt: {
      en: 'Nearly 78% of registered voters cast their ballots, the highest in two decades.',
      te: 'నమోదైన ఓటర్లలో దాదాపు 78% మంది ఓటు వేశారు; ఇది రెండు దశాబ్దాల్లోనే అత్యధికం.',
    },
    image: img('1494172961521-33799ddd43a5', 600),
    category: 'political-news',
    author: authors.marcusReed,
    date: '2026-10-08',
  },
  {
    id: 'devotional-golden-temple-langar',
    title: {
      en: 'Golden Temple Langar Serves a Record Number of Visitors During Festival',
      te: 'ఉత్సవాల్లో రికార్డు సంఖ్యలో భక్తులకు స్వర్ణ దేవాలయ లంగర్ సేవ',
    },
    excerpt: {
      en: 'Volunteers prepared meals around the clock for more than two lakh devotees a day.',
      te: 'రోజుకు రెండు లక్షల మందికి పైగా భక్తుల కోసం వాలంటీర్లు నిరంతరాయంగా భోజనం సిద్ధం చేశారు.',
    },
    image: img('1609947017136-9daf32a5eb16', 600),
    category: 'devotional',
    author: authors.emmaHart,
    date: '2026-10-08',
  },
  {
    id: 'devotional-mosque-restoration',
    title: {
      en: 'Historic Mosque Restoration Completed Ahead of Festival Prayers',
      te: 'పండుగ ప్రార్థనలకు ముందే చారిత్రక మసీదు పునరుద్ధరణ పూర్తి',
    },
    excerpt: {
      en: 'Craftsmen spent three years restoring the domes, minarets and original tilework.',
      te: 'గుమ్మటాలు, మినార్లు, అసలైన టైల్ పనితనాన్ని పునరుద్ధరించేందుకు కళాకారులు మూడేళ్లు శ్రమించారు.',
    },
    image: img('1519817650390-64a93db51149', 600),
    category: 'devotional',
    author: authors.sofiaLane,
    date: '2026-10-07',
  },
  {
    id: 'education-board-results',
    title: {
      en: 'Board Exam Results Announced; Pass Percentage Rises to 92%',
      te: 'బోర్డు పరీక్షల ఫలితాలు విడుదల; 92%కి పెరిగిన ఉత్తీర్ణత',
    },
    excerpt: {
      en: 'Girls outperformed boys for the fifth year in a row, officials said.',
      te: 'వరుసగా ఐదో ఏడాదీ బాలురను మించి బాలికలు రాణించారని అధికారులు తెలిపారు.',
    },
    image: img('1503676260728-1c00da094a0b', 600),
    category: 'education',
    author: authors.lilyGrace,
    date: '2026-10-08',
  },
  {
    id: 'education-libraries-24x7',
    title: {
      en: 'University Libraries to Stay Open 24/7 During Exam Season',
      te: 'పరీక్షల సీజన్‌లో 24 గంటలూ తెరిచి ఉండనున్న యూనివర్సిటీ గ్రంథాలయాలు',
    },
    excerpt: {
      en: 'Students welcomed the move, which also includes free late-night shuttle buses.',
      te: 'అర్ధరాత్రి వేళ ఉచిత షటిల్ బస్సులు కూడా ఉన్న ఈ నిర్ణయాన్ని విద్యార్థులు స్వాగతించారు.',
    },
    image: img('1497633762265-9d179a990aa6', 600),
    category: 'education',
    author: authors.danielCho,
    date: '2026-10-07',
  },
  {
    id: 'health-regional-diets',
    title: {
      en: 'Nutritionists Recommend Regional Diets for Better Heart Health',
      te: 'గుండె ఆరోగ్యానికి ప్రాంతీయ ఆహారమే మేలంటున్న పోషకాహార నిపుణులు',
    },
    excerpt: {
      en: 'Traditional meals rich in millets and vegetables beat many modern diet trends.',
      te: 'చిరుధాన్యాలు, కూరగాయలు అధికంగా ఉండే సంప్రదాయ భోజనం ఎన్నో ఆధునిక డైట్ ట్రెండ్ల కంటే మెరుగైనది.',
    },
    image: img('1490645935967-10de6ba17061', 600),
    category: 'health',
    author: authors.emmaHart,
    date: '2026-10-08',
  },
  {
    id: 'crime-cyber-helpline',
    title: {
      en: 'New Cybercrime Helpline Resolves 10,000 Complaints in First Month',
      te: 'తొలి నెలలోనే 10,000 ఫిర్యాదులను పరిష్కరించిన కొత్త సైబర్ క్రైమ్ హెల్ప్‌లైన్',
    },
    excerpt: {
      en: 'Most cases involved online shopping scams and fake job offers.',
      te: 'వీటిలో ఎక్కువగా ఆన్‌లైన్ షాపింగ్ మోసాలు, నకిలీ ఉద్యోగ ఆఫర్ల కేసులే ఉన్నాయి.',
    },
    image: img('1450101499163-c8848c66ca85', 600),
    category: 'crime',
    author: authors.marcusReed,
    date: '2026-10-08',
  },
  {
    id: 'cinema-single-screens',
    title: {
      en: 'Single-Screen Theatres Make a Comeback with Retro Film Festivals',
      te: 'రెట్రో చిత్రోత్సవాలతో సింగిల్ స్క్రీన్ థియేటర్లకు పూర్వ వైభవం',
    },
    excerpt: {
      en: 'Classic re-releases are drawing packed houses to old neighbourhood cinemas.',
      te: 'క్లాసిక్ చిత్రాల రీ-రిలీజ్‌లతో పాత థియేటర్లు ప్రేక్షకులతో కిక్కిరిసిపోతున్నాయి.',
    },
    image: img('1536440136628-849c177e76a1', 600),
    category: 'cinema',
    author: authors.lilyGrace,
    date: '2026-10-08',
  },
  {
    id: 'others-solar-record',
    title: {
      en: 'Global Solar Power Output Hits New Record, Surpassing Forecasts',
      te: 'అంచనాలను మించి ప్రపంచ సౌర విద్యుత్ ఉత్పత్తిలో కొత్త రికార్డు',
    },
    excerpt: {
      en: 'Solar generation grew faster than any other energy source this year.',
      te: 'ఈ ఏడాది మరే ఇతర ఇంధన వనరు కంటే సౌర విద్యుత్ ఉత్పత్తి వేగంగా పెరిగింది.',
    },
    image: img('1509391366360-2e959784a276', 600),
    category: 'others',
    author: authors.emmaHart,
    date: '2026-10-08',
  },
  {
    id: 'others-ev-city',
    title: {
      en: 'Electric Cars Outnumber Petrol Vehicles in Major City Centre',
      te: 'ప్రధాన నగర కేంద్రంలో పెట్రోల్ వాహనాలను మించిన ఎలక్ట్రిక్ కార్లు',
    },
    excerpt: {
      en: 'A decade of incentives and charging investment has reshaped downtown traffic.',
      te: 'దశాబ్ద కాలపు ప్రోత్సాహకాలు, ఛార్జింగ్ పెట్టుబడులు నగర కేంద్రం ట్రాఫిక్ రూపురేఖలను మార్చేశాయి.',
    },
    image: img('1593941707882-a5bba14938c7', 600),
    category: 'others',
    author: authors.marcusReed,
    date: '2026-10-07',
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

export const articlesInCategory = (category: CategorySlug) => allArticles.filter((a) => a.category === category)
