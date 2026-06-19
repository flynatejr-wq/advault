import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('agent_user_id', user.id)
    .order('scheduled_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()
  const { agent_user_id, booker_name, booker_email, booker_phone, product_interest, notes, scheduled_at, duration_minutes } = body

  if (!agent_user_id || !booker_name || !booker_email || !scheduled_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({ agent_user_id, booker_name, booker_email, booker_phone, product_interest, notes, scheduled_at, duration_minutes: duration_minutes || 30, status: 'confirmed' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
