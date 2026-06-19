'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLead } from '@/hooks/useLead'
import { LeadScoreBadge } from '@/components/leads/LeadScoreBadge'
import { StageBadge } from '@/components/leads/StageBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Card } from '@/components/ui/Card'
import type { LeadStage, Lead } from '@/types'
import { PRODUCT_LABELS, STAGE_LABELS, STAGE_ORDER } from '@/types'
import { Copy, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { lead, loading, update } = useLead(params.id)
  const [notes, setNotes] = useState<string>('')
  const [notesInitialized, setNotesInitialized] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [dealValueOpen, setDealValueOpen] = useState(false)
  const [dealValue, setDealValue] = useState('')
  const [copied, setCopied] = useState(false)
  const [reVetting, setReVetting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (lead && !notesInitialized) {
    setNotes(lead.notes ?? '')
    setNotesInitialized(true)
  }

  async function handleStageChange(stage: LeadStage) {
    await update({ stage })
    if (stage === 'closed_won') {
      setDealValueOpen(true)
    }
  }

  async function handleSaveDealValue() {
    const val = parseFloat(dealValue)
    if (!isNaN(val)) {
      await update({ deal_value: val, closed_at: new Date().toISOString() })
    }
    setDealValueOpen(false)
    setDealValue('')
  }

  async function handleReVet() {
    if (!lead) return
    setReVetting(true)
    try {
      const res = await fetch(`/api/leads/${lead.id}/vet`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const updated = await res.json() as Lead
      await update({ score: updated.score, score_reason: updated.score_reason, ai_script: updated.ai_script })
      toast.success('Lead re-vetted')
    } catch {
      toast.error('Re-vetting failed')
    } finally {
      setReVetting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/leads/${params.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Lead deleted')
      router.push('/dashboard/leads')
    } else {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  function copyScript() {
    if (!lead?.ai_script) return
    navigator.clipboard.writeText(lead.ai_script)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const selectClass = 'bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent'

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-bg-secondary rounded-card animate-pulse" />
        ))}
      </div>
    )
  }

  if (!lead) {
    return <div className="p-6 text-text-secondary">Lead not found.</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to leads
      </Link>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">{lead.name}</h1>
            <p className="text-text-secondary text-sm mt-0.5">{lead.email}</p>
            {lead.phone && <p className="text-text-secondary text-sm">{lead.phone}</p>}
          </div>
          <LeadScoreBadge score={lead.score} />
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <select
            className={selectClass}
            value={lead.stage}
            onChange={e => handleStageChange(e.target.value as LeadStage)}
          >
            {STAGE_ORDER.map(s => (
              <option key={s} value={s}>{STAGE_LABELS[s]}</option>
            ))}
          </select>
          <StageBadge stage={lead.stage} />
        </div>
      </Card>

      {/* Vetting */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-text-primary font-medium">AI vetting</h2>
          <Button variant="ghost" size="sm" onClick={handleReVet} loading={reVetting}>
            Re-vet
          </Button>
        </div>
        {lead.score_reason ? (
          <p className="text-text-secondary text-sm">{lead.score_reason}</p>
        ) : (
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AI is analyzing this lead…
          </div>
        )}
      </Card>

      {/* Details */}
      <Card>
        <h2 className="text-text-primary font-medium mb-3">Lead details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {([
            ['Product', PRODUCT_LABELS[lead.product_interest]],
            ['Coverage', lead.coverage_amount ?? '—'],
            ['Age', lead.age ? String(lead.age) : '—'],
            ['Health', lead.health_status ?? '—'],
            ['Urgency', lead.urgency ?? '—'],
            ['Source', lead.source],
            ['UTM campaign', lead.utm_campaign ?? '—'],
            ['Landing page', lead.landing_page_slug ?? '—'],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k}>
              <dt className="text-text-secondary">{k}</dt>
              <dd className="text-text-primary mt-0.5 capitalize">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* AI Script */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-text-primary font-medium">AI call script</h2>
          {lead.ai_script && (
            <button
              onClick={copyScript}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {copied
                ? <Check className="w-4 h-4 text-success" />
                : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
        {lead.ai_script ? (
          <pre className="text-text-secondary text-sm whitespace-pre-wrap font-sans leading-relaxed">
            {lead.ai_script}
          </pre>
        ) : (
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Generating call script…
          </div>
        )}
      </Card>

      {/* Notes */}
      <Card>
        <h2 className="text-text-primary font-medium mb-3">Notes</h2>
        <textarea
          className="w-full bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent resize-none"
          rows={4}
          placeholder="Add notes about this lead…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (lead.notes ?? '')) update({ notes })
          }}
        />
        <p className="text-text-tertiary text-xs mt-1">Auto-saves on blur</p>
      </Card>

      {/* Deal value (closed won) */}
      {lead.stage === 'closed_won' && (
        <Card>
          <h2 className="text-text-primary font-medium mb-3">Deal value</h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-success">
              {lead.deal_value ? `$${lead.deal_value.toLocaleString()}` : '—'}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setDealValueOpen(true)}>
              {lead.deal_value ? 'Edit' : 'Add value'}
            </Button>
          </div>
        </Card>
      )}

      {/* Danger zone */}
      <Card>
        <h2 className="text-text-primary font-medium mb-3">Danger zone</h2>
        <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
          Delete lead
        </Button>
      </Card>

      {/* Delete modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete lead">
        <p className="text-text-secondary mt-4">
          Are you sure you want to permanently delete{' '}
          <strong className="text-text-primary">{lead.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>

      {/* Deal value modal */}
      <Modal open={dealValueOpen} onClose={() => setDealValueOpen(false)} title="Add deal value">
        <p className="text-text-secondary mt-4">
          Optionally record the value of this closed deal.
        </p>
        <div className="mt-4 flex gap-2 items-center">
          <span className="text-text-secondary">$</span>
          <input
            type="number"
            className="flex-1 bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
            placeholder="0.00"
            value={dealValue}
            onChange={e => setDealValue(e.target.value)}
          />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDealValueOpen(false)} className="flex-1">
            Skip
          </Button>
          <Button onClick={handleSaveDealValue} className="flex-1">
            Save
          </Button>
        </div>
      </Modal>
    </div>
  )
}
