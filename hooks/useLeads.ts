'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Lead, LeadStage } from '@/types'
import toast from 'react-hot-toast'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error('Failed to fetch leads')
      const data = await res.json()
      setLeads(data)
    } catch {
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStage = useCallback(async (id: string, stage: LeadStage) => {
    const extra: Partial<Lead> = stage === 'closed_won'
      ? { closed_at: new Date().toISOString() }
      : {}
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, ...extra }),
    })
    if (!res.ok) { toast.error('Failed to update stage'); return }
    const updated = await res.json() as Lead
    setLeads(prev => prev.map(l => l.id === id ? updated : l))
  }, [])

  const deleteLead = useCallback(async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete lead'); return }
    setLeads(prev => prev.filter(l => l.id !== id))
    toast.success('Lead deleted')
  }, [])

  return { leads, loading, refetch: fetchLeads, updateStage, deleteLead }
}
