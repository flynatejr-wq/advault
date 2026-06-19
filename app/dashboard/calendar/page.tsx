'use client'

import { useEffect, useState } from 'react'
import type { Appointment } from '@/types'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + weekOffset * 7)
  weekStart.setHours(0, 0, 0, 0)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json()).then(data => {
      setAppointments(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  function getAppointmentsForDay(day: Date) {
    return appointments.filter(a => {
      const d = new Date(a.scheduled_at)
      return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate()
    })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Calendar</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setWeekOffset(o => o - 1)} className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary">&larr; Prev</button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary">Today</button>
          <button onClick={() => setWeekOffset(o => o + 1)} className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary">Next &rarr;</button>
        </div>
      </div>

      {loading ? (
        <div className="text-text-tertiary">Loading...</div>
      ) : (
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-3" />
            {weekDays.map((day, i) => {
              const isToday = day.toDateString() === new Date().toDateString()
              return (
                <div key={i} className="p-3 text-center border-l border-border">
                  <p className="text-xs text-text-tertiary">{DAY_LABELS[day.getDay()]}</p>
                  <p className={`text-sm font-medium mt-0.5 ${isToday ? 'text-accent' : 'text-text-primary'}`}>{day.getDate()}</p>
                </div>
              )
            })}
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/50 min-h-[60px]">
                <div className="p-2 text-right text-xs text-text-tertiary pr-3 pt-1">
                  {hour % 12 || 12}{hour < 12 ? 'am' : 'pm'}
                </div>
                {weekDays.map((day, i) => {
                  const dayAppts = getAppointmentsForDay(day).filter(a => new Date(a.scheduled_at).getHours() === hour)
                  return (
                    <div key={i} className="border-l border-border/50 p-1">
                      {dayAppts.map(appt => (
                        <div key={appt.id} className="bg-accent/10 border border-accent/30 rounded p-1 text-xs">
                          <p className="font-medium text-accent truncate">{appt.booker_name}</p>
                          <p className="text-text-tertiary">{appt.duration_minutes}min</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
