import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_LABELS } from '@/types'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('leads')
    .select('product_interest')
    .eq('user_id', user.id)

  const counts: Record<string, number> = {}
  ;(data || []).forEach(lead => {
    const key = lead.product_interest as keyof typeof PRODUCT_LABELS
    counts[key] = (counts[key] || 0) + 1
  })

  const result = Object.entries(counts).map(([product, count]) => ({
    product: PRODUCT_LABELS[product as keyof typeof PRODUCT_LABELS] || product,
    count,
  }))
  return NextResponse.json(result)
}
