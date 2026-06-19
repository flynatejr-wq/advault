'use client'
import { useState, useMemo } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { LeadCard } from '@/components/leads/LeadCard'
import { AddLeadModal } from '@/components/leads/AddLeadModal'
import { Button } from '@/components/ui/Button'
import type { Lead, LeadStage } from '@/types'
import { STAGE_LABELS, STAGE_ORDER } from '@/types'
import { Plus, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type SortKey = 'newest' | 'oldest' | 'score_high' | 'score_low'

const TABS: Array<{ key: LeadStage | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  ...STAGE_ORDER.map(s => ({ key: s, label: STAGE_LABELS[s] })),
]

export default function LeadsPage() {
  const { leads, loading, refetch } = useLeads()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<LeadStage | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = leads
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
      )
    }
    if (tab !== 'all') list = list.filter(l => l.stage === tab)
    return [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sort === 'score_high') return (b.score ?? 0) - (a.score ?? 0)
      return (a.score ?? 0) - (b.score ?? 0)
    })
  }, [leads, search, tab, sort])

  const hotLeads = useMemo(
    () => leads.filter(l => (l.score ?? 0) >= 8 && (l.stage === 'new' || l.stage === 'contacted')),
    [leads]
  )

  function handleCreated(_lead: Lead) {
    refetch()
  }

  const selectClass = 'bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent'

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-display">Leads</h1>
          <p className="text-text-secondary text-sm mt-1">{leads.length} total leads</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add lead
        </Button>
      </div>

      {hotLeads.length > 0 && (
        <div className="mb-6 p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-card">
          <p className="text-[#FF6B35] text-sm font-semibold mb-3">
            🔥 {hotLeads.length} hot lead{hotLeads.length > 1 ? 's' : ''} need attention
          </p>
          <div className="space-y-2">
            {hotLeads.slice(0, 3).map(l => <LeadCard key={l.id} lead={l} compact />)}
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full bg-bg-tertiary border border-white/[0.08] rounded-input pl-9 pr-3 py-2 text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={selectClass} value={sort} onChange={e => setSort(e.target.value as SortKey)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="score_high">Score: high to low</option>
          <option value="score_low">Score: low to high</option>
        </select>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-3 py-1.5 rounded-btn text-sm font-medium whitespace-nowrap transition-colors',
              tab === t.key
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-70">
              {t.key === 'all'
                ? leads.length
                : leads.filter(l => l.stage === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-bg-secondary rounded-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-text-primary">No leads here yet</p>
          <p className="text-sm mt-1">
            {tab === 'all'
              ? 'Add your first lead or share a landing page to start collecting them.'
              : `No leads in the ${STAGE_LABELS[tab as LeadStage]} stage.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => <LeadCard key={l.id} lead={l} />)}
        </div>
      )}

      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={handleCreated} />
    </div>
  )
}
