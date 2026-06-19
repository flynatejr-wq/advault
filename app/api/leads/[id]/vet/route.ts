import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { vetLead } from '@/lib/vet-lead'
import type { LeadSubmitRequest } from '@/types'

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()
  if (error || !lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const result = await vetLead(lead as unknown as LeadSubmitRequest)

  const { data: updated } = await supabase
    .from('leads')
    .update({
      score: result.score,
      score_reason: result.score_reason,
      ai_script: result.ai_script,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  return NextResponse.json(updated)
}
