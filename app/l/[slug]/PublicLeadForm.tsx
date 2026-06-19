'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { LeadProductType, HealthStatus, Urgency } from '@/types'
import { PRODUCT_LABELS } from '@/types'

const COVERAGE_OPTIONS = ['Under $100k', '$100k–$250k', '$250k–$500k', '$500k+']

interface Props {
  agentUserId: string
  productType: LeadProductType | null
  ctaText: string
  slug: string
  utmCampaign?: string
  utmSource?: string
}

export function PublicLeadForm({
  agentUserId,
  productType,
  ctaText,
  slug,
  utmCampaign,
  utmSource,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    product_interest: productType ?? ('term_life' as LeadProductType),
    coverage_amount: '',
    age: '',
    health_status: '' as HealthStatus | '',
    urgency: '' as Urgency | '',
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const selectClass =
    'w-full bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : undefined,
          health_status: form.health_status || undefined,
          urgency: form.urgency || undefined,
          phone: form.phone || undefined,
          coverage_amount: form.coverage_amount || undefined,
          agent_user_id: agentUserId,
          landing_page_slug: slug,
          utm_campaign: utmCampaign,
          utm_source: utmSource,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-bg-secondary border border-white/[0.08] rounded-card p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-text-primary text-xl font-semibold">You&apos;re all set!</h2>
        <p className="text-text-secondary mt-2">
          We received your information and will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-secondary border border-white/[0.08] rounded-card p-6 space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Full name"
          required
          value={form.name}
          onChange={e => set('name', e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={e => set('email', e.target.value)}
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
        />
        <Input
          label="Age"
          type="number"
          value={form.age}
          onChange={e => set('age', e.target.value)}
        />
      </div>

      {!productType && (
        <div>
          <label className="text-label">I&apos;m interested in</label>
          <select
            className={selectClass}
            value={form.product_interest}
            onChange={e => set('product_interest', e.target.value)}
          >
            {(Object.entries(PRODUCT_LABELS) as [LeadProductType, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-label">Coverage amount</label>
          <select
            className={selectClass}
            value={form.coverage_amount}
            onChange={e => set('coverage_amount', e.target.value)}
          >
            <option value="">Not sure</option>
            {COVERAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="text-label">Health status</label>
          <select
            className={selectClass}
            value={form.health_status}
            onChange={e => set('health_status', e.target.value)}
          >
            <option value="">Prefer not to say</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-label">How soon do you need coverage?</label>
        <select
          className={selectClass}
          value={form.urgency}
          onChange={e => set('urgency', e.target.value)}
        >
          <option value="">Not sure</option>
          <option value="immediately">As soon as possible</option>
          <option value="1_3_months">Within 1–3 months</option>
          <option value="3_6_months">Within 3–6 months</option>
          <option value="researching">Just researching for now</option>
        </select>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      <Button type="submit" loading={loading} className="w-full py-3">
        {ctaText}
      </Button>
    </form>
  )
}
