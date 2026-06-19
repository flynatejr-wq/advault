import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: portal } = await supabase
    .from('client_portals')
    .select('id')
    .eq('lead_id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!portal) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('client_documents')
    .insert({ ...body, portal_id: portal.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
