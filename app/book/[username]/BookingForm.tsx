'use client'

import { useState } from 'react'
import { getAvailableSlots } from '@/lib/availability'
import type { TimeSlot } from '@/lib/availability'
import type { BookingSettings } from '@/types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function BookingForm({ settings }: { settings: BookingSettings }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [step, setStep] = useState<'date' | 'time' | 'form' | 'done'>('date')
  const [form, setForm] = useState({ name: '', email: '', phone: '', product_interest: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = viewDate.getDay()

  async function selectDate(d: Date) {
    setSelectedDate(d)
    const res = await fetch('/api/appointments').then(r => r.json()).catch(() => [])
    const existing = Array.isArray(res) ? res.map((a: { scheduled_at: string }) => a.scheduled_at) : []
    const available = getAvailableSlots(settings, d, existing)
    setSlots(available)
    setStep('time')
  }

  async function book() {
    if (!selectedSlot || !form.name || !form.email) return
    setLoading(true)
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_user_id: settings.user_id,
        ...form,
        scheduled_at: selectedSlot,
        duration_minutes: settings.call_duration_minutes,
      }),
    })
    setStep('done')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">{settings.display_name}</h1>
          {settings.bio && <p className="text-text-secondary mt-2 text-sm">{settings.bio}</p>}
          <p className="text-xs text-text-tertiary mt-1">{settings.call_duration_minutes} min call &middot; {settings.timezone}</p>
        </div>

        {step === 'date' && (
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMonthOffset(o => o - 1)} className="text-text-tertiary hover:text-text-primary px-2">&larr;</button>
              <span className="text-sm font-medium text-text-primary">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
              <button onClick={() => setMonthOffset(o => o + 1)} className="text-text-tertiary hover:text-text-primary px-2">&rarr;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-xs text-text-tertiary py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={i} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)
                const isPast = d < today
                const isAvailable = settings.available_days.includes(d.getDay())
                return (
                  <button
                    key={i}
                    onClick={() => !isPast && isAvailable && selectDate(d)}
                    disabled={isPast || !isAvailable}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      isPast || !isAvailable
                        ? 'text-text-tertiary opacity-30 cursor-not-allowed'
                        : 'text-text-primary hover:bg-accent hover:text-white cursor-pointer'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 'time' && selectedDate && (
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <button onClick={() => setStep('date')} className="text-sm text-text-tertiary mb-4 hover:text-text-primary">&larr; Back</button>
            <h2 className="font-medium text-text-primary mb-4">
              {DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
            </h2>
            {slots.length === 0 ? (
              <p className="text-text-tertiary text-sm">No available times on this day.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {slots.map(slot => (
                  <button
                    key={slot.start}
                    onClick={() => { setSelectedSlot(slot.start); setStep('form') }}
                    className="py-2 border border-border rounded-lg text-sm text-text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'form' && (
          <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-4">
            <button onClick={() => setStep('time')} className="text-sm text-text-tertiary hover:text-text-primary">&larr; Back</button>
            <h2 className="font-medium text-text-primary">Your information</h2>
            {[
              { label: 'Full name *', key: 'name', type: 'text' },
              { label: 'Email *', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone', type: 'tel' },
              { label: 'Product interest', key: 'product_interest', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-text-tertiary block mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-text-tertiary block mb-1">Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary resize-none"
              />
            </div>
            <button
              onClick={book}
              disabled={loading || !form.name || !form.email}
              className="w-full py-2.5 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">&#10003;</div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Booking Confirmed!</h2>
            <p className="text-text-secondary text-sm">You&apos;ll receive a confirmation shortly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
