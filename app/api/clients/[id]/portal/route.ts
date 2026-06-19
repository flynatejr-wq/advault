import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('client_portals')
    .select('*, client_documents(*)')
    .eq('lead_id', params.id)
    .eq('user_id', user.id)
    .single()

  return NextResponse.json(data || null)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data: existing } = await supabase
    .from('client_portals')
    .select('id')
    .eq('lead_id', params.id)
    .eq('user_id', user.id)
    .single()

  let result
  if (existing) {
    const { data } = await supabase
      .from('client_portals')
      .update(body)
      .eq('id', existing.id)
      .select()
      .single()
    result = data
  } else {
    const { data } = await supabase
      .from('client_portals')
      .insert({ ...body, lead_id: params.id, user_id: user.id })
      .select()
      .single()
    result = data
  }

  return NextResponse.json(result)
}
