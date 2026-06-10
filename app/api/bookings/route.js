import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendBookingNotification } from '@/lib/email'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { name, email, callType, packageName, date, time } = body

  if (!name || !email || !callType || !packageName || !date || !time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      name,
      email,
      call_type: callType,
      package_name: packageName,
      date,
      time,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send email notification to admin (non-blocking)
  sendBookingNotification(data)

  return NextResponse.json(data, { status: 201 })
}
