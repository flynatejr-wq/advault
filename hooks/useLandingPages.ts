'use client'
import { useState, useEffect, useCallback } from 'react'
import type { LandingPage, LeadProductType } from '@/types'
import toast from 'react-hot-toast'

export function useLandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/landing-pages')
      if (!res.ok) throw new Error('Failed')
      setPages(await res.json())
    } catch {
      toast.error('Failed to load landing pages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPages() }, [fetchPages])

  const createPage = useCallback(async (payload: {
    slug: string
    title: string
    headline: string
    subheadline: string | null
    product_type: LeadProductType | null
    cta_text: string
    active: boolean
  }) => {
    const res = await fetch('/api/landing-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) { toast.error('Failed to create page'); return }
    const page = await res.json() as LandingPage
    setPages(prev => [page, ...prev])
    toast.success('Landing page created')
    return page
  }, [])

  const deletePage = useCallback(async (slug: string) => {
    const res = await fetch(`/api/landing-pages/${slug}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete page'); return }
    setPages(prev => prev.filter(p => p.slug !== slug))
    toast.success('Page deleted')
  }, [])

  return { pages, loading, createPage, deletePage, refetch: fetchPages }
}
