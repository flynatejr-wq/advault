'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Sequence } from '@/types'

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    fetch('/api/sequences').then(r => r.json()).then(data => {
      setSequences(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  async function createSequence() {
    if (!name.trim()) return
    const res = await fetch('/api/sequences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), active: true }),
    })
    const seq = await res.json()
    setSequences(prev => [seq, ...prev])
    setName('')
    setCreating(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Follow-up Sequences</h1>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          New Sequence
        </button>
      </div>

      {creating && (
        <div className="mb-6 bg-surface-raised border border-border rounded-xl p-4 flex gap-3">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createSequence()}
            placeholder="Sequence name..."
            className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
          />
          <button onClick={createSequence} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium">Create</button>
          <button onClick={() => setCreating(false)} className="px-4 py-2 text-text-tertiary text-sm">Cancel</button>
        </div>
      )}

      {loading ? (
        <div className="text-text-tertiary">Loading...</div>
      ) : sequences.length === 0 ? (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-lg font-medium mb-2">No sequences yet</p>
          <p className="text-sm">Create automated follow-up sequences to nurture your leads.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sequences.map(seq => (
            <Link
              key={seq.id}
              href={`/dashboard/sequences/${seq.id}`}
              className="flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4 hover:border-accent/50 transition-colors"
            >
              <div>
                <p className="font-medium text-text-primary">{seq.name}</p>
                {seq.product_type && <p className="text-xs text-text-tertiary mt-0.5">{seq.product_type}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${seq.active ? 'bg-success/10 text-success' : 'bg-surface text-text-tertiary'}`}>
                {seq.active ? 'Active' : 'Paused'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
