'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { OutputPanel } from '@/components/campaign/OutputPanel'
import { useGenerate } from '@/hooks/useGenerate'
import { formatDate } from '@/lib/utils'
import type { Campaign, GeneratedOutput } from '@/types'

const CHANNEL_LABELS: Record<string, string> = { social: 'Social', google: 'Google', email: 'Email' }

export default function CampaignDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { output, streaming, streamText, generate } = useGenerate()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const [currentOutput, setCurrentOutput] = useState<GeneratedOutput | null>(null)

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then((r) => r.json() as Promise<Campaign>)
      .then((data) => {
        setCampaign(data)
        setCurrentOutput(data.output)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load campaign')
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (output) setCurrentOutput(output)
  }, [output])

  async function handleRegenerate() {
    if (!campaign) return
    const newOutput = await generate({
      product: campaign.product,
      audience: campaign.audience,
      sellingPoints: campaign.selling_points ?? '',
      cta: campaign.cta ?? '',
      tone: campaign.tone,
      channels: campaign.channels,
    })
    if (newOutput) {
      await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ output: newOutput }),
      })
      toast.success('Campaign regenerated')
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Campaign deleted')
      router.push('/dashboard/campaigns')
    } else {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-bg-secondary rounded animate-pulse mb-6" />
        <div className="h-48 bg-bg-secondary rounded-card animate-pulse" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary">Campaign not found.</p>
        <Link href="/dashboard/campaigns" className="mt-4 inline-block">
          <Button variant="ghost">Back to campaigns</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/campaigns">
          <button className="text-text-secondary hover:text-text-primary transition-colors p-1">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold heading-display truncate">{campaign.name}</h1>
          <p className="text-text-tertiary text-xs">{formatDate(campaign.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleRegenerate} loading={streaming}>
            <RefreshCw size={13} /> Regenerate
          </Button>
          <Button size="sm" variant="danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Collapsible brief summary */}
      <Card className="mb-4">
        <button
          onClick={() => setBriefOpen((v) => !v)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium">Campaign Brief</span>
          <span className="text-text-tertiary text-xs">{briefOpen ? 'Hide' : 'Show'}</span>
        </button>
        {briefOpen && (
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><span className="text-text-tertiary">Product:</span> <span className="ml-1">{campaign.product}</span></div>
            <div><span className="text-text-tertiary">Audience:</span> <span className="ml-1">{campaign.audience}</span></div>
            <div><span className="text-text-tertiary">Tone:</span> <span className="ml-1">{campaign.tone}</span></div>
            <div><span className="text-text-tertiary">CTA:</span> <span className="ml-1">{campaign.cta}</span></div>
            {campaign.selling_points && (
              <div className="col-span-2">
                <span className="text-text-tertiary">Selling points:</span>
                <span className="ml-1">{campaign.selling_points}</span>
              </div>
            )}
            <div className="col-span-2 flex gap-1.5 mt-1">
              {campaign.channels.map((ch) => (
                <Badge key={ch} variant="accent">{CHANNEL_LABELS[ch]}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Streaming preview */}
      {streaming && (
        <Card className="mb-4">
          <p className="text-text-tertiary text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-hidden">
            {streamText}
            <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse" />
          </p>
        </Card>
      )}

      {/* Output */}
      {currentOutput && !streaming && (
        <Card>
          <OutputPanel output={currentOutput} channels={campaign.channels} />
        </Card>
      )}

      {/* Empty output state */}
      {!currentOutput && !streaming && (
        <Card>
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm">No output yet.</p>
            <Button size="sm" className="mt-3" onClick={handleRegenerate}>Generate now</Button>
          </div>
        </Card>
      )}

      {/* Delete modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete campaign">
        <p className="text-text-secondary text-sm mb-6">
          Permanently delete <strong className="text-text-primary">{campaign.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
