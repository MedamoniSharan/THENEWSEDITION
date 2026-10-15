import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, Eye, EyeOff, LogOut } from 'lucide-react'
import { api } from '../api'
import { toast } from '../toast'
import { Button, Card, Field, IconButton, Input, PageHeader, Spinner } from '../ui'

function LoginDetails({ email }: { email?: string }) {
  const [shown, setShown] = useState(false)
  // Loaded up front so Copy can write to the clipboard straight from the click, which Safari requires.
  const password = useQuery({
    queryKey: ['password'],
    queryFn: () => api.get<{ password: string }>('/auth/password').then((r) => r.password),
    staleTime: Infinity,
    gcTime: 0,
  })

  const copy = () => {
    if (password.data === undefined) return
    navigator.clipboard.writeText(password.data).then(
      () => toast.success('Password copied'),
      () => toast.error('Could not copy the password'),
    )
  }

  return (
    <Card title="Login details" className="max-w-lg">
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="font-medium text-ink">Email</dt>
          <dd className="mt-1 text-ink/70">{email}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink">Current password</dt>
          <dd className="mt-1 flex items-center gap-1 rounded-lg border border-ink/15 bg-paper py-1 pr-1 pl-3">
            <span className={`flex-1 truncate font-mono ${shown ? 'text-ink' : 'tracking-widest text-ink/50'}`}>
              {!shown ? '••••••••••' : password.isPending ? <Spinner className="size-4" /> : password.data}
            </span>
            <IconButton label={shown ? 'Hide password' : 'Show password'} onClick={() => setShown((s) => !s)}>
              {shown ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
            <IconButton label="Copy password" onClick={copy} disabled={password.data === undefined}>
              <Copy size={16} />
            </IconButton>
          </dd>
        </div>
      </dl>
    </Card>
  )
}

export default function Account() {
  const qc = useQueryClient()
  const email = qc.getQueryData<{ email: string } | null>(['me'])?.email
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const changePassword = useMutation({
    mutationFn: () => api.post('/auth/password', { current, next }),
    onSuccess: () => {
      qc.setQueryData(['password'], next)
      setCurrent('')
      setNext('')
      setConfirm('')
      toast.success('Password changed. Other devices have been signed out.')
    },
  })

  const logout = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      qc.clear()
      qc.setQueryData(['me'], null)
    },
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (next !== confirm) return toast.error('The new passwords don’t match')
    if (next === current) return toast.error('The new password must be different from the current one')
    changePassword.mutate()
  }

  return (
    <>
      <PageHeader
        title="Account & password"
        description={email ? `Signed in as ${email}` : undefined}
        actions={
          <Button icon={<LogOut size={15} />} onClick={() => logout.mutate()} loading={logout.isPending}>
            Sign out
          </Button>
        }
      />
      <div className="space-y-6">
        <LoginDetails email={email} />
        <Card title="Change password" className="max-w-lg">
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-ink/55">After the change you stay signed in here; any other browser or device using this account is signed out.</p>
            <Field label="Current password">
              {(id) => <Input id={id} type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />}
            </Field>
            <Field label="New password" hint="At least 8 characters.">
              {(id) => <Input id={id} type="password" autoComplete="new-password" minLength={8} required value={next} onChange={(e) => setNext(e.target.value)} />}
            </Field>
            <Field label="Repeat new password">
              {(id) => <Input id={id} type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />}
            </Field>
            <Button type="submit" variant="primary" loading={changePassword.isPending}>
              Change password
            </Button>
          </form>
        </Card>
      </div>
    </>
  )
}
