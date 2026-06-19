'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Lead } from '@/types'

export default function ClientsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leads?stage=closed_won').then(r => r.json()).then(data => {
      setLeads(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Clients</h1>

      {loading ? (
        <div className="text-text-tertiary">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-lg font-medium mb-2">No clients yet</p>
          <p className="text-sm">Closed won leads will appear here as clients.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map(lead => (
            <div key={lead.id} className="flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4">
              <div>
                <p className="font-medium text-text-primary">{lead.name}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{lead.email}</p>
              </div>
              <Link
                href={'/dashboard/leads/' + lead.id}
                className="text-xs text-text-tertiary hover:text-accent"
              >
                View lead
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
