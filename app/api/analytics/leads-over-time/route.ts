import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const { data } = await supabase
    .from('leads')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at')

  const counts: Record<string, number> = {}
  ;(data || []).forEach(lead => {
    const date = lead.created_at.split('T')[0]
    counts[date] = (counts[date] || 0) + 1
  })

  const result = Object.entries(counts).map(([date, count]) => ({ date, count }))
  return NextResponse.json(result)
}
