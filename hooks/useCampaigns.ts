'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import type { Campaign } from '@/types'

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json() as Campaign[]
      setCampaigns(data)
    } catch {
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCampaign = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
      toast.success('Campaign deleted')
    } catch {
      toast.error('Failed to delete campaign')
    }
  }, [])

  return { campaigns, loading, fetchCampaigns, deleteCampaign }
}
