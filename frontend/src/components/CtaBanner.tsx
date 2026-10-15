import { useContent } from '../content/context'
import { useLanguage } from '../i18n/language'
import Logo from './ui/Logo'

const buttonClass =
  'mt-8 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--color-accent)] transition-colors hover:bg-accent-dark'

export default function CtaBanner() {
  const { t, tr } = useLanguage()
  const { settings } = useContent()

  return (
    <section className="flex flex-col items-center py-16 text-center md:py-24">
      <Logo variant="badge" className="h-24 md:h-28" />
      <h2 className="mt-6 max-w-2xl text-4xl leading-[1.1] font-semibold tracking-tight text-ink md:text-6xl">
        {tr(settings.tagline) || t.tagline}
      </h2>
      {settings.subscribeUrl ? (
        <a href={settings.subscribeUrl} className={buttonClass}>
          {t.subscribe}
        </a>
      ) : (
        <button type="button" className={buttonClass}>
          {t.subscribe}
        </button>
      )}
    </section>
  )
}
