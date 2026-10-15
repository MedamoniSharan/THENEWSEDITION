import { useMemo } from 'react'
import BilingualField from '../BilingualField'
import { useDraft, useSaveSettings, useSettings } from '../hooks'
import MediaField from '../media/MediaField'
import type { SettingsRecord } from '../types'
import { Card, Field, Input, LoadingBlock, PageHeader, SaveBar, Toggle } from '../ui'

type SiteSettings = Pick<SettingsRecord, 'tagline' | 'intro' | 'instagram' | 'socials' | 'contact' | 'subscribeUrl'>

const socialFields: { key: keyof SettingsRecord['socials']; label: string }[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'youtube', label: 'YouTube channel' },
  { key: 'linkedin', label: 'LinkedIn' },
]

export default function Settings() {
  const { data, isPending } = useSettings()
  const save = useSaveSettings()
  const source = useMemo<SiteSettings | undefined>(
    () =>
      data && {
        tagline: data.tagline,
        intro: data.intro,
        instagram: data.instagram,
        socials: data.socials,
        contact: data.contact,
        subscribeUrl: data.subscribeUrl,
      },
    [data],
  )
  const { draft, setDraft, dirty, reset } = useDraft(source)
  if (isPending || !draft) return <LoadingBlock />

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setDraft((d) => ({ ...d, [key]: value }))

  return (
    <>
      <PageHeader title="Site settings" description="The tagline, intro video, contact details and social links." />

      <div className="space-y-4">
        <Card title="Tagline" description="The big headline above the search box and in the banner near the bottom of the page.">
          <BilingualField label="Tagline" value={draft.tagline} onChange={(tagline) => set('tagline', tagline)} />
        </Card>

        <Card title="Intro video" description="Plays full screen every time someone opens the website, then fades into the homepage.">
          <div className="space-y-5">
            <Toggle checked={draft.intro.enabled} onChange={(enabled) => set('intro', { ...draft.intro, enabled })} label={draft.intro.enabled ? 'Intro is on' : 'Intro is off'} />
            {draft.intro.enabled && (
              <MediaField
                label="Intro video"
                kind="video"
                value={draft.intro.video}
                onChange={(video) => set('intro', { ...draft.intro, video })}
                hint="Keep it under 10 seconds and a few MB so the site opens quickly."
              />
            )}
          </div>
        </Card>

        <Card title="Instagram" description="Shown as “Follow us @…” above the reels.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Handle">
              {(id) => <Input id={id} value={draft.instagram.handle} onChange={(e) => set('instagram', { ...draft.instagram, handle: e.target.value })} placeholder="@TheNewsEdition" />}
            </Field>
            <Field label="Profile link">
              {(id) => <Input id={id} value={draft.instagram.url} onChange={(e) => set('instagram', { ...draft.instagram, url: e.target.value.trim() })} placeholder="https://instagram.com/…" />}
            </Field>
          </div>
        </Card>

        <Card title="Social links" description="Icons in the footer. Leave a box empty to hide that icon.">
          <div className="grid gap-4 sm:grid-cols-2">
            {socialFields.map((s) => (
              <Field key={s.key} label={s.label}>
                {(id) => (
                  <Input id={id} value={draft.socials[s.key]} onChange={(e) => set('socials', { ...draft.socials, [s.key]: e.target.value.trim() })} placeholder="https://…" />
                )}
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Contact" description="Shown in the footer. Leave a box empty to hide it.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">{(id) => <Input id={id} type="tel" value={draft.contact.phone} onChange={(e) => set('contact', { ...draft.contact, phone: e.target.value })} />}</Field>
            <Field label="Email">{(id) => <Input id={id} type="email" value={draft.contact.email} onChange={(e) => set('contact', { ...draft.contact, email: e.target.value.trim() })} />}</Field>
            <Field label="Directions link" hint="For example a Google Maps link." className="sm:col-span-2">
              {(id) => <Input id={id} value={draft.contact.directionsUrl} onChange={(e) => set('contact', { ...draft.contact, directionsUrl: e.target.value.trim() })} placeholder="https://maps.google.com/…" />}
            </Field>
          </div>
        </Card>

        <Card title="Subscribe button" description="Where the “Subscribe Now” button goes, e.g. a WhatsApp channel or newsletter sign-up.">
          <Field label="Link">{(id) => <Input id={id} value={draft.subscribeUrl} onChange={(e) => set('subscribeUrl', e.target.value.trim())} placeholder="https://…" />}</Field>
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={save.isPending} onReset={reset} onSave={() => save.mutate(draft)} />
    </>
  )
}
