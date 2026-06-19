'use client'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Lead, LeadProductType, HealthStatus, Urgency } from '@/types'
import { PRODUCT_LABELS } from '@/types'
import toast from 'react-hot-toast'

const COVERAGE_OPTIONS = ['Under $100k', '$100k–$250k', '$250k–$500k', '$500k+']
const HEALTH_OPTIONS: { value: HealthStatus; label: string }[] = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]
const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1_3_months', label: '1–3 months' },
  { value: '3_6_months', label: '3–6 months' },
  { value: 'researching', label: 'Just researching' },
]

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (lead: Lead) => void
}

export function AddLeadModal({ open, onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    product_interest: 'term_life' as LeadProductType,
    coverage_amount: '', age: '',
    health_status: '' as HealthStatus | '',
    urgency: '' as Urgency | '',
    notes: '',
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const selectClass = 'w-full bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : null,
          health_status: form.health_status || null,
          urgency: form.urgency || null,
          phone: form.phone || null,
          coverage_amount: form.coverage_amount || null,
          notes: form.notes || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to create lead')
      const lead = await res.json() as Lead
      onCreated(lead)
      toast.success('Lead added')
      onClose()
    } catch {
      toast.error('Failed to add lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add lead manually">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Full name" required value={form.name} onChange={e => set('name', e.target.value)} />
          <Input label="Email" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
          <Input label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
          <Input label="Age" type="number" value={form.age} onChange={e => set('age', e.target.value)} />
        </div>
        <div>
          <label className="text-label">Product interest</label>
          <select className={selectClass} value={form.product_interest} onChange={e => set('product_interest', e.target.value)}>
            {(Object.entries(PRODUCT_LABELS) as [LeadProductType, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label">Coverage amount</label>
            <select className={selectClass} value={form.coverage_amount} onChange={e => set('coverage_amount', e.target.value)}>
              <option value="">Not specified</option>
              {COVERAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-label">Health status</label>
            <select className={selectClass} value={form.health_status} onChange={e => set('health_status', e.target.value)}>
              <option value="">Not specified</option>
              {HEALTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-label">Timeline / urgency</label>
          <select className={selectClass} value={form.urgency} onChange={e => set('urgency', e.target.value)}>
            <option value="">Not specified</option>
            {URGENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-label">Notes</label>
          <textarea
            className="w-full bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent resize-none"
            rows={3}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Add lead</Button>
        </div>
      </form>
    </Modal>
  )
}
