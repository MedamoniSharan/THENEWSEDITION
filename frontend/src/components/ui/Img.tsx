import { useState, type ImgHTMLAttributes } from 'react'
import { responsiveImage } from '../../content/api'

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string
  /** Width used when the browser can't pick from the srcset. */
  width?: number
}

/**
 * Image with a responsive srcset for uploaded and Unsplash images; pass `sizes` to match the layout.
 * Shows a shimmer placeholder until the image has loaded.
 */
export default function Img({ src, width, alt = '', loading = 'lazy', className = '', ...rest }: ImgProps) {
  const [loadedSrc, setLoadedSrc] = useState<string>()
  if (!src) return <div className={`bg-ink/10 ${className}`} aria-hidden />
  const image = responsiveImage(src, width)
  const markLoaded = () => setLoadedSrc(image.src)

  return (
    <img
      {...rest}
      ref={(el) => {
        // Already-cached images can finish before React attaches onLoad.
        if (el?.complete && el.naturalWidth && loadedSrc !== image.src) markLoaded()
      }}
      src={image.src}
      srcSet={image.srcSet}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={markLoaded}
      onError={markLoaded}
      className={`${className} ${loadedSrc === image.src ? '' : 'img-loading'}`}
    />
  )
}
