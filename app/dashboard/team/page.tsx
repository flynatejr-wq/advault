'use client'

import { useEffect, useState } from 'react'
import type { TeamMember } from '@/types'

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('agent')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(data => {
      setMembers(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  async function invite() {
    if (!email.trim()) return
    setInviting(true)
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), role }),
    })
    const member = await res.json()
    setMembers(prev => [member, ...prev])
    setEmail('')
    setInviting(false)
  }

  async function remove(id: string) {
    await fetch('/api/team/' + id, { method: 'DELETE' })
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-warning/10 text-warning',
    active: 'bg-success/10 text-success',
    disabled: 'bg-surface text-text-tertiary',
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Team</h1>

      <div className="bg-surface-raised border border-border rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">Invite team member</h2>
        <div className="flex gap-3">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
          />
          <select value={role} onChange={e => setRole(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary">
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={invite}
            disabled={inviting || !email.trim()}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Invite
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-text-tertiary">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-text-tertiary">No team members yet</div>
      ) : (
        <div className="space-y-2">
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4">
              <div>
                <p className="font-medium text-text-primary">{m.email}</p>
                <p className="text-xs text-text-tertiary capitalize mt-0.5">{m.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[m.status] || ''}`}>{m.status}</span>
                <button onClick={() => remove(m.id)} className="text-xs text-text-tertiary hover:text-danger">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
