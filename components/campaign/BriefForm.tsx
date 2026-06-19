'use client'

import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { CampaignBrief, Tone, ProductType, TargetAudience } from '@/types'

const PRODUCTS: ProductType[] = ['Term life', 'Whole life', 'Final expense', 'Universal life', 'Mortgage protection', 'IUL']
const AUDIENCES: TargetAudience[] = ['Parents with young children', 'Seniors 60+', 'Newlyweds', 'Small business owners', 'Homeowners', 'Veterans', 'New homebuyers']
const TONES: Tone[] = ['Empathetic', 'Urgent', 'Educational', 'Friendly', 'Professional']

interface BriefFormProps {
  value: Partial<CampaignBrief>
  onChange: (updates: Partial<CampaignBrief>) => void
  errors: Partial<Record<keyof CampaignBrief, string>>
}

export function BriefForm({ value, onChange, errors }: BriefFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Campaign name"
        value={value.name ?? ''}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Term Life — Young Parents Q3"
        error={errors.name}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-label">Product type</label>
        <select
          value={value.product ?? ''}
          onChange={(e) => onChange({ product: e.target.value as ProductType })}
          className={cn(
            'h-10 px-3 rounded-input bg-bg-tertiary border border-white/[0.08]',
            'text-text-primary text-sm focus:border-accent focus:outline-none transition-colors',
            errors.product && 'border-danger'
          )}
        >
          <option value="">Select product type</option>
          {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.product && <p className="text-danger text-xs">{errors.product}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-label">Target audience</label>
        <select
          value={value.audience ?? ''}
          onChange={(e) => onChange({ audience: e.target.value as TargetAudience })}
          className={cn(
            'h-10 px-3 rounded-input bg-bg-tertiary border border-white/[0.08]',
            'text-text-primary text-sm focus:border-accent focus:outline-none transition-colors',
            errors.audience && 'border-danger'
          )}
        >
          <option value="">Select target audience</option>
          {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.audience && <p className="text-danger text-xs">{errors.audience}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-label">Key selling points <span className="normal-case text-text-tertiary">(optional)</span></label>
        <textarea
          value={value.sellingPoints ?? ''}
          onChange={(e) => onChange({ sellingPoints: e.target.value })}
          placeholder="No medical exam, from $12/mo, instant approval"
          rows={3}
          className="px-3 py-2.5 rounded-input bg-bg-tertiary border border-white/[0.08] text-text-primary placeholder:text-text-tertiary text-sm focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <Input
        label="Call to action"
        value={value.cta ?? ''}
        onChange={(e) => onChange({ cta: e.target.value })}
        placeholder="Get your free quote"
        error={errors.cta}
      />

      <div className="flex flex-col gap-2">
        <label className="text-label">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ tone: t })}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm border transition-all duration-150',
                value.tone === t
                  ? 'bg-accent-subtle border-accent text-accent'
                  : 'border-white/[0.12] text-text-secondary hover:border-white/[0.25] hover:text-text-primary'
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {errors.tone && <p className="text-danger text-xs">{errors.tone}</p>}
      </div>
    </div>
  )
}
