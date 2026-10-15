import type { Localized } from '../types.ts'
import type { CategorySlug } from './news.ts'

export const instagram = {
  handle: '@TheNewsEdition',
  url: '#',
}

export interface NewsReel {
  category: CategorySlug
  caption: Localized
}

/** Clips live in `frontend/public/reels/<category>.mp4` with a matching `.webp` poster. */
export const newsReels: NewsReel[] = [
  {
    category: 'political-news',
    caption: { en: 'Polling day: how India votes', te: 'పోలింగ్ రోజు: భారత్ ఎలా ఓటేస్తుంది' },
  },
  {
    category: 'devotional',
    caption: { en: 'Bonalu: Telangana honours the Goddess', te: 'బోనాలు: అమ్మవారికి తెలంగాణ నైవేద్యం' },
  },
  {
    category: 'education',
    caption: { en: 'Government schools: girls lead the class', te: 'ప్రభుత్వ బడులు: తరగతిలో బాలికల ముందంజ' },
  },
  {
    category: 'health',
    caption: { en: 'Pulse Polio: two drops, every child', te: 'పల్స్ పోలియో: ప్రతి బిడ్డకు రెండు చుక్కలు' },
  },
  {
    category: 'crime',
    caption: {
      en: 'Police step up festival security in Hyderabad',
      te: 'హైదరాబాద్‌లో పండుగ భద్రత కట్టుదిట్టం చేసిన పోలీసులు',
    },
  },
  {
    category: 'cinema',
    caption: { en: 'Telangana folk stars take the stage', te: 'వేదికపై తెలంగాణ జానపద తారలు' },
  },
  {
    category: 'others',
    caption: { en: 'Around Charminar: the Old City today', te: 'చార్మినార్ చుట్టూ: నేటి పాతబస్తీ' },
  },
]

export type TestimonialTile =
  | { kind: 'brand' }
  /** Plays every reel in order, starting from `newsReels[start]`. */
  | { kind: 'reel'; start: number }
  | { kind: 'quote'; name: Localized; role: Localized; paragraphs: Localized[] }

/** Laid out left to right, top to bottom in a five-column grid. */
export const testimonialTiles: TestimonialTile[] = [
  { kind: 'brand' },
  { kind: 'reel', start: 2 },
  {
    kind: 'quote',
    name: { en: 'Priya Sharma', te: 'ప్రియా శర్మ' },
    role: { en: 'Teacher, Hyderabad', te: 'ఉపాధ్యాయురాలు, హైదరాబాద్' },
    paragraphs: [
      {
        en: 'My morning chai isn’t complete without TheNewsEdition.',
        te: 'TheNewsEdition లేకుండా నా ఉదయపు చాయ్ పూర్తి కాదు.',
      },
      {
        en: 'The Education section helps me keep my students updated on every exam notification and result.',
        te: 'ప్రతి పరీక్ష నోటిఫికేషన్, ఫలితం గురించి నా విద్యార్థులకు తెలియజేయడానికి విద్య విభాగం ఎంతో ఉపయోగపడుతుంది.',
      },
    ],
  },
  { kind: 'reel', start: 6 },
  {
    kind: 'quote',
    name: { en: 'Ravi Teja', te: 'రవితేజ' },
    role: { en: 'Software Engineer', te: 'సాఫ్ట్‌వేర్ ఇంజనీర్' },
    paragraphs: [
      {
        en: 'Short, clear and no clickbait. I scroll the Hot News bar on my commute and I’m caught up before I reach the office.',
        te: 'చిన్నగా, స్పష్టంగా, క్లిక్‌బైట్ లేకుండా. ప్రయాణంలో హాట్ న్యూస్ బార్ చూస్తే చాలు, ఆఫీసుకు చేరేలోపే అన్నీ తెలిసిపోతాయి.',
      },
      {
        en: 'Finally a news site that respects my time!',
        te: 'నా సమయాన్ని గౌరవించే న్యూస్ సైట్ ఎట్టకేలకు దొరికింది!',
      },
    ],
  },
  { kind: 'reel', start: 3 },
  {
    kind: 'quote',
    name: { en: 'Dr. Anil Kumar', te: 'డా. అనిల్ కుమార్' },
    role: { en: 'Physician, Warangal', te: 'వైద్యుడు, వరంగల్' },
    paragraphs: [
      {
        en: 'I recommend the Health section to my patients.',
        te: 'నా రోగులకు ఆరోగ్యం విభాగాన్ని చదవమని సూచిస్తాను.',
      },
      {
        en: 'The stories are accurate, easy to understand and never sensational.',
        te: 'కథనాలు కచ్చితంగా, సులభంగా అర్థమయ్యేలా ఉంటాయి. ఎప్పుడూ సంచలనాల కోసం రాయరు.',
      },
    ],
  },
  { kind: 'reel', start: 0 },
  {
    kind: 'quote',
    name: { en: 'Lakshmi Devi', te: 'లక్ష్మీ దేవి' },
    role: { en: 'Homemaker, Karimnagar', te: 'గృహిణి, కరీంనగర్' },
    paragraphs: [
      {
        en: 'I check the Devotional page every day for festival dates and temple timings.',
        te: 'పండుగ తేదీలు, ఆలయ వేళల కోసం రోజూ భక్తి పేజీ చూస్తాను.',
      },
      {
        en: 'It feels like it was made for families like mine. My whole house reads it now!',
        te: 'మా లాంటి కుటుంబాల కోసమే తయారుచేసినట్టు అనిపిస్తుంది. ఇప్పుడు మా ఇంట్లో అందరూ చదువుతున్నారు!',
      },
    ],
  },
  { kind: 'reel', start: 1 },
]
