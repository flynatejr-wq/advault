'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BriefForm } from '@/components/campaign/BriefForm'
import { ChannelSelector } from '@/components/campaign/ChannelSelector'
import { OutputPanel } from '@/components/campaign/OutputPanel'
import { useGenerate } from '@/hooks/useGenerate'
import { cn } from '@/lib/utils'
import type { CampaignBrief, Channel } from '@/types'

type Step = 1 | 2 | 3

const STEPS = ['Brief', 'Channels', 'Generate']

export default function NewCampaignPage() {
  const router = useRouter()
  const { output, streaming, streamText, generate, reset } = useGenerate()

  const [step, setStep] = useState<Step>(1)
  const [brief, setBrief] = useState<Partial<CampaignBrief>>({})
  const [channels, setChannels] = useState<Channel[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof CampaignBrief | 'channels', string>>>({})
  const [saving, setSaving] = useState(false)

  function validateBrief(): boolean {
    const e: typeof errors = {}
    if (!brief.name?.trim()) e.name = 'Campaign name is required'
    if (!brief.product) e.product = 'Select a product type'
    if (!brief.audience) e.audience = 'Select a target audience'
    if (!brief.cta?.trim()) e.cta = 'Call to action is required'
    if (!brief.tone) e.tone = 'Select a tone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function goToStep2() {
    if (validateBrief()) setStep(2)
  }

  function goToStep3() {
    if (!channels.length) {
      setErrors((e) => ({ ...e, channels: 'Select at least one channel' }))
      return
    }
    setErrors((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { channels: _c, ...rest } = e
      return rest
    })
    setStep(3)
  }

  async function handleGenerate() {
    reset()
    await generate({
      product: brief.product!,
      audience: brief.audience!,
      sellingPoints: brief.sellingPoints ?? '',
      cta: brief.cta ?? '',
      tone: brief.tone!,
      channels,
    })
  }

  async function handleSave() {
    if (!output) return
    setSaving(true)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brief.name,
          product: brief.product,
          audience: brief.audience,
          selling_points: brief.sellingPoints ?? null,
          cta: brief.cta ?? null,
          tone: brief.tone,
          channels,
          output,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      const saved = await res.json() as { id: string }
      toast.success('Campaign saved!')
      router.push(`/dashboard/campaigns/${saved.id}`)
    } catch {
      toast.error('Failed to save campaign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => {
          const n = (i + 1) as Step
          const done = step > n
          const active = step === n
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                  active ? 'bg-accent text-white' : done ? 'bg-success text-white' : 'bg-bg-tertiary text-text-tertiary'
                )}>
                  {done ? '✓' : n}
                </div>
                <span className={cn('text-sm hidden sm:block', active ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-3', step > n ? 'bg-success/40' : 'bg-white/[0.08]')} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Brief */}
      {step === 1 && (
        <Card>
          <h1 className="text-lg font-semibold heading-display mb-6">Campaign Brief</h1>
          <BriefForm
            value={brief}
            onChange={(updates) => setBrief((prev) => ({ ...prev, ...updates }))}
            errors={errors}
          />
          <Button className="mt-6 w-full" onClick={goToStep2}>Continue</Button>
        </Card>
      )}

      {/* Step 2: Channels */}
      {step === 2 && (
        <Card>
          <h1 className="text-lg font-semibold heading-display mb-2">Choose Channels</h1>
          <p className="text-text-secondary text-sm mb-6">Select the ad channels for this campaign.</p>
          <ChannelSelector selected={channels} onChange={setChannels} error={errors.channels} />
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" onClick={goToStep3}>Continue</Button>
          </div>
        </Card>
      )}

      {/* Step 3: Generate */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          {/* Brief summary */}
          <Card>
            <h2 className="text-sm font-semibold mb-3 text-text-secondary">Campaign Summary</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div><span className="text-text-tertiary">Name:</span> <span className="text-text-primary ml-1">{brief.name}</span></div>
              <div><span className="text-text-tertiary">Product:</span> <span className="text-text-primary ml-1">{brief.product}</span></div>
              <div><span className="text-text-tertiary">Audience:</span> <span className="text-text-primary ml-1">{brief.audience}</span></div>
              <div><span className="text-text-tertiary">Tone:</span> <span className="text-text-primary ml-1">{brief.tone}</span></div>
            </div>
          </Card>

          {/* Generate button */}
          <Button onClick={handleGenerate} loading={streaming} disabled={streaming} size="lg" className="w-full">
            {streaming ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Generating…
              </>
            ) : output ? 'Regenerate' : 'Generate Campaign'}
          </Button>

          {/* Streaming preview */}
          {streaming && !output && (
            <Card>
              <p className="text-text-tertiary text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-hidden max-h-40">
                {streamText}
                <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse" />
              </p>
            </Card>
          )}

          {/* Output panels */}
          {output && (
            <Card>
              <OutputPanel output={output} channels={channels} />
            </Card>
          )}

          {/* Save + Edit buttons */}
          {output && (
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>Edit Brief</Button>
              <Button className="flex-1" onClick={handleSave} loading={saving}>
                Save Campaign
              </Button>
            </div>
          )}

          {/* Back button when no output yet */}
          {!output && !streaming && (
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
          )}
        </div>
      )}
    </div>
  )
}
