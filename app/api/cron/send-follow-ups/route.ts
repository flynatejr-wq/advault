import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { personalizeMessage } from '@/lib/personalize-message'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const now = new Date().toISOString()

  const { data: enrollments } = await supabase
    .from('sequence_enrollments')
    .select('*, leads(*), sequences(user_id)')
    .eq('status', 'active')
    .lte('next_send_at', now)

  if (!enrollments || enrollments.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  let processed = 0

  for (const enrollment of enrollments) {
    const { data: step } = await supabase
      .from('sequence_steps')
      .select('*')
      .eq('sequence_id', enrollment.sequence_id)
      .eq('step_number', enrollment.current_step)
      .single()

    if (!step) {
      await supabase
        .from('sequence_enrollments')
        .update({ status: 'completed', completed_at: now })
        .eq('id', enrollment.id)
      continue
    }

    const lead = enrollment.leads as { name: string; email: string; product_interest: string; score: number | null }
    const body = step.ai_personalized
      ? await personalizeMessage(step.body, lead)
      : step.body

    await supabase.from('sequence_sends').insert({
      enrollment_id: enrollment.id,
      step_id: step.id,
      lead_id: enrollment.lead_id,
      channel: step.channel,
      subject: step.subject,
      body,
      status: 'sent',
    })

    const { data: nextStep } = await supabase
      .from('sequence_steps')
      .select('delay_hours')
      .eq('sequence_id', enrollment.sequence_id)
      .eq('step_number', enrollment.current_step + 1)
      .single()

    if (nextStep) {
      const nextSendAt = new Date(Date.now() + nextStep.delay_hours * 3600000).toISOString()
      await supabase
        .from('sequence_enrollments')
        .update({ current_step: enrollment.current_step + 1, next_send_at: nextSendAt })
        .eq('id', enrollment.id)
    } else {
      await supabase
        .from('sequence_enrollments')
        .update({ status: 'completed', completed_at: now })
        .eq('id', enrollment.id)
    }

    processed++
  }

  return NextResponse.json({ processed })
}
