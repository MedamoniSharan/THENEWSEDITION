import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { api } from '../api'
import { toast } from '../toast'
import { Button, Card, Field, Input, PageHeader } from '../ui'

export default function Account() {
  const qc = useQueryClient()
  const email = qc.getQueryData<{ email: string } | null>(['me'])?.email
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const changePassword = useMutation({
    mutationFn: () => api.post('/auth/password', { current, next }),
    onSuccess: () => {
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
    </>
  )
}
