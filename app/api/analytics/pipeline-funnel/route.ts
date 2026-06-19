import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { STAGE_LABELS, STAGE_ORDER } from '@/types'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('leads')
    .select('stage')
    .eq('user_id', user.id)

  const counts: Record<string, number> = {}
  ;(data || []).forEach(lead => {
    counts[lead.stage] = (counts[lead.stage] || 0) + 1
  })

  const result = STAGE_ORDER.map(stage => ({
    stage: STAGE_LABELS[stage],
    count: counts[stage] || 0,
  }))
  return NextResponse.json(result)
}
