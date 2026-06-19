'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [campaignCount, setCampaignCount] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    supabase
      .from('campaigns')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', monthStart)
      .then(({ count }) => setCampaignCount(count ?? 0))
  }, [])

  async function handlePasswordReset() {
    setResetting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset email sent')
    }
    setResetting(false)
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      await supabase.auth.signOut()
      router.push('/')
    } catch {
      toast.error('Failed to delete account. Contact support.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold heading-display mb-6">Settings</h1>

      {/* Account section */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold mb-4">Account</h2>
        <Input label="Email" value={email} readOnly className="opacity-60 cursor-not-allowed" />
        <Button size="sm" variant="ghost" className="mt-4" onClick={handlePasswordReset} loading={resetting}>
          Send password reset email
        </Button>
      </Card>

      {/* API & Usage section */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold mb-1">API & Usage</h2>
        <p className="text-text-secondary text-sm mb-4">
          AdVault uses Claude AI on the backend — no API key required. Your campaigns are generated securely server-side.
        </p>
        <div className="flex items-center justify-between bg-bg-tertiary rounded-lg px-4 py-3">
          <span className="text-text-secondary text-sm">Campaigns this month</span>
          <span className="text-text-primary font-semibold tabular-nums">
            {campaignCount === null ? '—' : campaignCount}
          </span>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-danger/20">
        <h2 className="text-sm font-semibold text-danger mb-1">Danger Zone</h2>
        <p className="text-text-secondary text-sm mb-4">
          Permanently delete your account and all campaign data. This cannot be undone.
        </p>
        <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
          Delete account
        </Button>
      </Card>

      {/* Delete account modal */}
      <Modal
        open={showDelete}
        onClose={() => { setShowDelete(false); setDeleteConfirm('') }}
        title="Delete account"
      >
        <p className="text-text-secondary text-sm mb-4">
          Type <strong className="text-danger font-mono">DELETE</strong> to confirm permanent account deletion.
        </p>
        <Input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="DELETE"
          className="mb-4 font-mono"
        />
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => { setShowDelete(false); setDeleteConfirm('') }}>Cancel</Button>
          <Button
            variant="danger"
            className="flex-1"
            disabled={deleteConfirm !== 'DELETE'}
            loading={deleting}
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </div>
      </Modal>
    </div>
  )
}
