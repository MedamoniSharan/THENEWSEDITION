import type { Localized } from '../i18n/types'

export interface YouTubeVideo {
  id: string
  title: Localized
  channel: string
}

export const featuredVideo: YouTubeVideo = {
  id: 'bYBchF0RFAo',
  title: { en: 'Saleswaram Song', te: 'సలేశ్వరం పాట' },
  channel: 'Aashvi Sahasra Digitals',
}

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`
