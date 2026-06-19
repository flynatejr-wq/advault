import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [{ count: total }, { count: thisMonth }, { data: wonLeads }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', monthStart),
    supabase.from('leads').select('deal_value, score').eq('user_id', user.id).eq('stage', 'closed_won'),
  ])

  const { count: hotLeads } = await supabase
    .from('leads').select('*', { count: 'exact', head: true })
    .eq('user_id', user.id).gte('score', 8)

  const { count: closedWon } = await supabase
    .from('leads').select('*', { count: 'exact', head: true })
    .eq('user_id', user.id).eq('stage', 'closed_won')

  const totalRevenue = (wonLeads || []).reduce((sum, l) => sum + (l.deal_value || 0), 0)
  const avgDealValue = wonLeads && wonLeads.length > 0 ? totalRevenue / wonLeads.length : 0
  const conversionRate = total && total > 0 ? ((closedWon || 0) / total) * 100 : 0

  return NextResponse.json({
    total_leads: total || 0,
    leads_this_month: thisMonth || 0,
    conversion_rate: Math.round(conversionRate * 10) / 10,
    avg_deal_value: Math.round(avgDealValue),
    total_revenue: totalRevenue,
    hot_leads: hotLeads || 0,
  })
}
