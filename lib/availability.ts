import type { BookingSettings } from '@/types'

export interface TimeSlot {
  start: string
  label: string
}

export function getAvailableSlots(settings: BookingSettings, date: Date, existingAppointments: string[]): TimeSlot[] {
  const dayOfWeek = date.getDay()
  if (!settings.available_days.includes(dayOfWeek)) return []

  const [startHour, startMin] = settings.available_start_time.split(':').map(Number)
  const [endHour, endMin] = settings.available_end_time.split(':').map(Number)

  const slots: TimeSlot[] = []
  const slotDuration = settings.call_duration_minutes + settings.buffer_minutes
  const noticeMs = settings.booking_notice_hours * 3600000
  const now = Date.now()

  let current = new Date(date)
  current.setHours(startHour, startMin, 0, 0)
  const end = new Date(date)
  end.setHours(endHour, endMin, 0, 0)

  while (current < end) {
    const slotEnd = new Date(current.getTime() + settings.call_duration_minutes * 60000)
    if (slotEnd <= end && current.getTime() > now + noticeMs) {
      const iso = current.toISOString()
      const conflict = existingAppointments.some(appt => {
        const apptTime = new Date(appt).getTime()
        return Math.abs(apptTime - current.getTime()) < slotDuration * 60000
      })
      if (!conflict) {
        const hours = current.getHours()
        const mins = current.getMinutes().toString().padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const label = `${hours % 12 || 12}:${mins} ${ampm}`
        slots.push({ start: iso, label })
      }
    }
    current = new Date(current.getTime() + slotDuration * 60000)
  }

  return slots
}

export function getWeekDates(weekOffset = 0): Date[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek + 1 + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}
