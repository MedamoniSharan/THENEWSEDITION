import type { Language } from './types'

const en = {
  languageName: 'English',
  languageLabel: 'Language',
  home: 'Home',
  homeLink: 'TheNewsEdition home',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  tagline: 'Find News that Meet With Your Needs',
  searchLabel: 'Search news',
  searchPlaceholder: 'Search your recent news...',
  searchButton: 'Search Now',
  breakingNews: 'Breaking news',
  hotNews: 'Hot News',
  viewMore: 'View More',
  latestNews: 'Latest News',
  nextStories: 'Next stories',
  previousStories: 'Previous stories',
  pauseAutoScroll: 'Pause auto-scroll',
  resumeAutoScroll: 'Resume auto-scroll',
  popularStory: 'Popular Story',
  highlight: 'Highlight',
  videos: 'Videos',
  watchOnYoutube: 'Watch on YouTube',
  playVideo: 'Play video',
  breadcrumb: 'Breadcrumb',
  loadMore: 'Load more stories',
  loadFailed: 'We couldn’t load the news right now.',
  tryAgain: 'Try again',
  storyCount: (n: number) => `${n} ${n === 1 ? 'story' : 'stories'}`,
  noStories: (category: string) => `No stories in ${category} yet`,
  noStoriesHint: 'Check back soon, or browse another category above.',
  followUs: 'Follow us',
  realReaders: 'Real readers. Real opinions.',
  testimonialsIntro: 'The comments section, but kinder. Hear what our readers say.',
  realFeedback: ['Real', 'feedback.'],
  reelLabel: (category: string, caption: string) => `${category} reel: ${caption}`,
  pauseReel: 'Pause reel',
  playReel: 'Play reel',
  subscribe: 'Subscribe Now',
  categories: 'Categories',
  sections: 'Sections',
  contact: 'Contact',
  getDirections: 'Get Directions',
  copyright: (year: number) => `© ${year} TheNewsEdition. All rights reserved.`,
}

export type UiStrings = typeof en

const te: UiStrings = {
  languageName: 'తెలుగు',
  languageLabel: 'భాష',
  home: 'హోమ్',
  homeLink: 'TheNewsEdition హోమ్',
  openMenu: 'మెనూ తెరవండి',
  closeMenu: 'మెనూ మూసివేయండి',
  tagline: 'మీ అవసరాలకు తగిన వార్తలు ఇక్కడే',
  searchLabel: 'వార్తలు వెతకండి',
  searchPlaceholder: 'తాజా వార్తలు వెతకండి...',
  searchButton: 'వెతకండి',
  breakingNews: 'బ్రేకింగ్ న్యూస్',
  hotNews: 'హాట్ న్యూస్',
  viewMore: 'మరిన్ని',
  latestNews: 'తాజా వార్తలు',
  nextStories: 'తదుపరి కథనాలు',
  previousStories: 'మునుపటి కథనాలు',
  pauseAutoScroll: 'ఆటో-స్క్రోల్ ఆపండి',
  resumeAutoScroll: 'ఆటో-స్క్రోల్ కొనసాగించండి',
  popularStory: 'ప్రముఖ కథనం',
  highlight: 'ముఖ్యాంశాలు',
  videos: 'వీడియోలు',
  watchOnYoutube: 'యూట్యూబ్‌లో చూడండి',
  playVideo: 'వీడియో ప్లే చేయండి',
  breadcrumb: 'మార్గం',
  loadMore: 'మరిన్ని కథనాలు',
  loadFailed: 'ప్రస్తుతం వార్తలు లోడ్ కాలేదు.',
  tryAgain: 'మళ్లీ ప్రయత్నించండి',
  storyCount: (n: number) => `${n} ${n === 1 ? 'కథనం' : 'కథనాలు'}`,
  noStories: (category: string) => `${category} విభాగంలో ఇంకా కథనాలు లేవు`,
  noStoriesHint: 'త్వరలో మళ్లీ చూడండి, లేదా పైన మరో విభాగాన్ని ఎంచుకోండి.',
  followUs: 'మమ్మల్ని ఫాలో అవ్వండి',
  realReaders: 'నిజమైన పాఠకులు. నిజమైన అభిప్రాయాలు.',
  testimonialsIntro: 'కామెంట్ల సెక్షన్, కానీ మరింత ఆత్మీయంగా. మా పాఠకులు ఏమంటున్నారో వినండి.',
  realFeedback: ['పాఠకుల', 'మాట.'],
  reelLabel: (category: string, caption: string) => `${category} రీల్: ${caption}`,
  pauseReel: 'రీల్ ఆపండి',
  playReel: 'రీల్ ప్లే చేయండి',
  subscribe: 'ఇప్పుడే సబ్‌స్క్రైబ్ చేయండి',
  categories: 'విభాగాలు',
  sections: 'సెక్షన్లు',
  contact: 'సంప్రదించండి',
  getDirections: 'దారి తెలుసుకోండి',
  copyright: (year: number) => `© ${year} TheNewsEdition. సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.`,
}

export const ui: Record<Language, UiStrings> = { en, te }

type TextKey = { [K in keyof UiStrings]: UiStrings[K] extends string ? K : never }[keyof UiStrings]

/** Plain-text strings the admin can reword. The tagline is edited with the site settings instead. */
export const editableTextKeys = (Object.keys(en) as (keyof UiStrings)[]).filter(
  (key): key is TextKey => typeof en[key] === 'string' && key !== 'tagline',
)

export function withOverrides(strings: UiStrings, overrides?: Record<string, string>): UiStrings {
  if (!overrides) return strings
  const merged = { ...strings } as Record<string, unknown>
  for (const key of editableTextKeys) {
    const value = overrides[key]?.trim()
    if (value) merged[key] = value
  }
  return merged as UiStrings
}
