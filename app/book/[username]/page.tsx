import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingForm from './BookingForm'

export default async function BookingPage({ params }: { params: { username: string } }) {
  const supabase = createClient()
  const { data: settings } = await supabase
    .from('booking_settings')
    .select('*')
    .eq('username', params.username)
    .eq('active', true)
    .single()

  if (!settings) notFound()
  return <BookingForm settings={settings} />
}
