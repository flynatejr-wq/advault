'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Lead } from '@/types'
import toast from 'react-hot-toast'

export function useLead(id: string) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLead = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leads/${id}`)
      if (!res.ok) throw new Error('Not found')
      setLead(await res.json())
    } catch {
      toast.error('Failed to load lead')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchLead() }, [fetchLead])

  const update = useCallback(async (patch: Partial<Lead>) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) { toast.error('Failed to save'); return }
    const updated = await res.json() as Lead
    setLead(updated)
    toast.success('Saved')
    return updated
  }, [id])

  return { lead, loading, update, refetch: fetchLead }
}
