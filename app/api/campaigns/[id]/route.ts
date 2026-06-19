import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Campaign } from '@/types'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data as Campaign)
  } catch (err) {
    console.error('[campaign GET]', err)
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[campaign DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json() as Partial<Campaign>

    const { data, error } = await supabase
      .from('campaigns')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data as Campaign)
  } catch (err) {
    console.error('[campaign PATCH]', err)
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
  }
}
