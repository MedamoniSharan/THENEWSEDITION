import App from './App'
import IntroSplash from './components/IntroSplash'
import Logo from './components/ui/Logo'
import ContentProvider from './content/ContentProvider'
import { useContentState } from './content/context'
import LanguageProvider from './i18n/LanguageProvider'
import { useLanguage } from './i18n/language'

function LoadState() {
  const { failed, retry } = useContentState()
  const { t } = useLanguage()

  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        {failed ? (
          <>
            <p className="text-sm text-ink/70">{t.loadFailed}</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              {t.tryAgain}
            </button>
          </>
        ) : (
          <span className="size-8 animate-spin rounded-full border-2 border-ink/15 border-t-accent" aria-hidden />
        )}
      </div>
    </div>
  )
}

function SiteContent() {
  const { content } = useContentState()
  return (
    <LanguageProvider overrides={content?.settings.uiText}>
      {content ? <App /> : <LoadState />}
      <IntroSplash />
    </LanguageProvider>
  )
}

export default function Site() {
  return (
    <ContentProvider>
      <SiteContent />
    </ContentProvider>
  )
}
