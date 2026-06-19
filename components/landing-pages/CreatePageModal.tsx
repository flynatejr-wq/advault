'use client'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLandingPages } from '@/hooks/useLandingPages'
import type { LeadProductType } from '@/types'
import { PRODUCT_LABELS } from '@/types'

interface Props { open: boolean; onClose: () => void }

export function CreatePageModal({ open, onClose }: Props) {
  const { createPage } = useLandingPages()
  const [loading, setLoading] = useState(false)
  const [slugError, setSlugError] = useState('')
  const [form, setForm] = useState({
    slug: '',
    headline: '',
    subheadline: '',
    product_type: '' as LeadProductType | '',
    cta_text: 'Get My Free Quote',
  })

  const set = (k: string, v: string) => {
    if (k === 'slug') {
      setSlugError('')
      v = v.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    }
    setForm(p => ({ ...p, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.slug || !/^[a-z0-9-]+$/.test(form.slug)) {
      setSlugError('Only lowercase letters, numbers, and hyphens allowed')
      return
    }
    setLoading(true)
    await createPage({
      slug: form.slug,
      title: form.headline,
      headline: form.headline,
      subheadline: form.subheadline || null,
      product_type: (form.product_type as LeadProductType) || null,
      cta_text: form.cta_text || 'Get My Free Quote',
      active: true,
    })
    setLoading(false)
    setForm({ slug: '', headline: '', subheadline: '', product_type: '', cta_text: 'Get My Free Quote' })
    onClose()
  }

  const selectClass = 'w-full bg-bg-tertiary border border-white/[0.08] rounded-input px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent'

  return (
    <Modal open={open} onClose={onClose} title="Create landing page">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Input
          label="Page slug"
          required
          value={form.slug}
          onChange={e => set('slug', e.target.value)}
          hint={`Your page will be at /l/${form.slug || 'your-slug'}`}
          error={slugError}
        />
        <Input
          label="Headline"
          required
          value={form.headline}
          onChange={e => set('headline', e.target.value)}
          hint="Main headline shown to visitors"
        />
        <Input
          label="Subheadline (optional)"
          value={form.subheadline}
          onChange={e => set('subheadline', e.target.value)}
        />
        <div>
          <label className="text-label">Product type</label>
          <select
            className={selectClass}
            value={form.product_type}
            onChange={e => set('product_type', e.target.value)}
          >
            <option value="">All products</option>
            {(Object.entries(PRODUCT_LABELS) as [LeadProductType, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <Input
          label="CTA button text"
          value={form.cta_text}
          onChange={e => set('cta_text', e.target.value)}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Create page</Button>
        </div>
      </form>
    </Modal>
  )
}
