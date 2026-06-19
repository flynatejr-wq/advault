'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Card } from '@/components/ui/Card'
import { useCampaigns } from '@/hooks/useCampaigns'
import { formatDate } from '@/lib/utils'

const CHANNEL_LABELS: Record<string, string> = { social: 'Social', google: 'Google', email: 'Email' }

export default function CampaignsPage() {
  const { campaigns, loading, fetchCampaigns, deleteCampaign } = useCampaigns()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { fetchCampaigns() }, [fetchCampaigns])

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  async function confirmDelete() {
    if (!deleteId) return
    await deleteCampaign(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold heading-display">Campaigns</h1>
          <p className="text-text-secondary text-sm mt-1">{campaigns.length} total</p>
        </div>
        <Link href="/dashboard/new">
          <Button size="sm"><Plus size={14} /> New Campaign</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campaigns…"
          className="w-full h-10 pl-9 pr-3 rounded-input bg-bg-tertiary border border-white/[0.08] text-text-primary placeholder:text-text-tertiary text-sm focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Skeleton loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-bg-secondary border border-white/[0.08] rounded-card animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center mb-4">
            <Plus size={20} className="text-text-tertiary" />
          </div>
          <p className="text-text-secondary font-medium">
            {search ? `No campaigns matching "${search}"` : 'No campaigns yet'}
          </p>
          {!search && (
            <Link href="/dashboard/new" className="mt-3">
              <Button size="sm" variant="ghost">Create your first campaign →</Button>
            </Link>
          )}
        </div>
      )}

      {/* Campaign grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col gap-3 hover:border-white/[0.15] transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium text-text-primary truncate">{campaign.name}</h3>
                  <p className="text-text-tertiary text-xs mt-0.5">{formatDate(campaign.created_at)}</p>
                </div>
                <button
                  onClick={() => setDeleteId(campaign.id)}
                  className="text-text-tertiary hover:text-danger transition-colors flex-shrink-0 mt-0.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-text-secondary text-sm">{campaign.product} · {campaign.audience}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {campaign.channels.map((ch) => (
                    <Badge key={ch} variant="accent">{CHANNEL_LABELS[ch]}</Badge>
                  ))}
                </div>
                <Link href={`/dashboard/campaigns/${campaign.id}`}>
                  <Button size="sm" variant="ghost">
                    View <ExternalLink size={12} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete campaign"
      >
        <p className="text-text-secondary text-sm mb-6">
          This action cannot be undone. The campaign and all its generated copy will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
