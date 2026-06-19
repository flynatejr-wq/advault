'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { Sequence, SequenceStep } from '@/types'

export default function SequenceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [sequence, setSequence] = useState<Sequence | null>(null)
  const [steps, setSteps] = useState<SequenceStep[]>([])
  const [loading, setLoading] = useState(true)
  const [addingStep, setAddingStep] = useState(false)
  const [newStep, setNewStep] = useState({ delay_hours: 24, channel: 'email', subject: '', body: '', ai_personalized: true })

  useEffect(() => {
    Promise.all([
      fetch(`/api/sequences/${id}`).then(r => r.json()),
      fetch(`/api/sequences/${id}/steps`).then(r => r.json()),
    ]).then(([seq, s]) => {
      setSequence(seq)
      setSteps(Array.isArray(s) ? s : [])
      setLoading(false)
    })
  }, [id])

  async function addStep() {
    const res = await fetch(`/api/sequences/${id}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newStep, step_number: steps.length + 1 }),
    })
    const step = await res.json()
    setSteps(prev => [...prev, step])
    setNewStep({ delay_hours: 24, channel: 'email', subject: '', body: '', ai_personalized: true })
    setAddingStep(false)
  }

  async function deleteStep(stepId: string) {
    await fetch(`/api/sequences/${id}/steps/${stepId}`, { method: 'DELETE' })
    setSteps(prev => prev.filter(s => s.id !== stepId))
  }

  if (loading) return <div className="p-8 text-text-tertiary">Loading...</div>
  if (!sequence) return <div className="p-8 text-danger">Sequence not found</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{sequence.name}</h1>
          <p className="text-sm text-text-tertiary mt-0.5">{steps.length} steps</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.id} className="relative">
            {i < steps.length - 1 && (
              <div className="absolute left-4 top-full h-4 w-px bg-border" />
            )}
            <div className="bg-surface-raised border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">{step.step_number}</span>
                    <span className="text-xs text-text-tertiary">Wait {step.delay_hours}h then {step.channel.toUpperCase()}</span>
                    {step.ai_personalized && <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded">AI</span>}
                  </div>
                  {step.subject && <p className="text-sm font-medium text-text-primary mb-1">{step.subject}</p>}
                  <p className="text-sm text-text-secondary whitespace-pre-line line-clamp-3">{step.body}</p>
                </div>
                <button onClick={() => deleteStep(step.id)} className="text-text-tertiary hover:text-danger text-xs">Remove</button>
              </div>
            </div>
          </div>
        ))}

        {addingStep ? (
          <div className="bg-surface-raised border border-accent/30 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Delay (hours)</label>
                <input type="number" value={newStep.delay_hours} onChange={e => setNewStep(p => ({ ...p, delay_hours: +e.target.value }))}
                  className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary" />
              </div>
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Channel</label>
                <select value={newStep.channel} onChange={e => setNewStep(p => ({ ...p, channel: e.target.value }))}
                  className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-text-tertiary block mb-1">Subject (email only)</label>
              <input value={newStep.subject} onChange={e => setNewStep(p => ({ ...p, subject: e.target.value }))}
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary" />
            </div>
            <div>
              <label className="text-xs text-text-tertiary block mb-1">Message body</label>
              <textarea rows={4} value={newStep.body} onChange={e => setNewStep(p => ({ ...p, body: e.target.value }))}
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-sm text-text-primary resize-none" />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={newStep.ai_personalized} onChange={e => setNewStep(p => ({ ...p, ai_personalized: e.target.checked }))} />
              AI personalize for each lead
            </label>
            <div className="flex gap-2">
              <button onClick={addStep} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium">Add Step</button>
              <button onClick={() => setAddingStep(false)} className="px-4 py-2 text-text-tertiary text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingStep(true)}
            className="w-full border border-dashed border-border rounded-xl p-4 text-sm text-text-tertiary hover:text-text-secondary hover:border-border-hover transition-colors"
          >
            + Add Step
          </button>
        )}
      </div>
    </div>
  )
}
