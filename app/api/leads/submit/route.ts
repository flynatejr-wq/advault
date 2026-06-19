import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { vetLead } from '@/lib/vet-lead'
import type { LeadSubmitRequest } from '@/types'

export async function POST(request: Request) {
  const supabase = createClient()
  const body = (await request.json()) as LeadSubmitRequest & { agent_user_id: string }

  if (!body.agent_user_id) {
    return NextResponse.json({ error: 'agent_user_id required' }, { status: 400 })
  }
  if (!body.name || !body.email || !body.product_interest) {
    return NextResponse.json({ error: 'name, email, and product_interest required' }, { status: 400 })
  }

  const { data: lead, error: insertError } = await supabase
    .from('leads')
    .insert({
      user_id: body.agent_user_id,
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      product_interest: body.product_interest,
      coverage_amount: body.coverage_amount ?? null,
      age: body.age ?? null,
      health_status: body.health_status ?? null,
      urgency: body.urgency ?? null,
      source: 'landing_page',
      utm_campaign: body.utm_campaign ?? null,
      utm_source: body.utm_source ?? null,
      landing_page_slug: body.landing_page_slug ?? null,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  // AI vet in background — don't block the response
  vetLead(body).then(async (result) => {
    await supabase
      .from('leads')
      .update({
        score: result.score,
        score_reason: result.score_reason,
        ai_script: result.ai_script,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id)
  }).catch(console.error)

  return NextResponse.json({ success: true, lead_id: lead.id }, { status: 201 })
}
