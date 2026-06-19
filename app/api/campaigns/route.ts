import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Campaign } from '@/types'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data as Campaign[])
  } catch (err) {
    console.error('[campaigns GET]', err)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json() as Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>

    const { data, error } = await supabase
      .from('campaigns')
      .insert({ ...body, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data as Campaign, { status: 201 })
  } catch (err) {
    console.error('[campaigns POST]', err)
    return NextResponse.json({ error: 'Failed to save campaign' }, { status: 500 })
  }
}
