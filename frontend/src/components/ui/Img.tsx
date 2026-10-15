import type { ImgHTMLAttributes } from 'react'
import { responsiveImage } from '../../content/api'

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string
  /** Width used when the browser can't pick from the srcset. */
  width?: number
}

/** Image with a responsive srcset for uploaded and Unsplash images; pass `sizes` to match the layout. */
export default function Img({ src, width, alt = '', loading = 'lazy', ...rest }: ImgProps) {
  if (!src) return <div className={`bg-ink/10 ${rest.className ?? ''}`} aria-hidden />
  const image = responsiveImage(src, width)
  return <img {...rest} src={image.src} srcSet={image.srcSet} alt={alt} loading={loading} decoding="async" />
}
