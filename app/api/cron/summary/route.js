import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const authHeader = process.env.CRON_SECRET
    ? request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
    : true

  if (!authHeader && process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [bookingsRes, ticketsRes, messagesRes] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: false }).gte('created_at', weekStart),
    supabase.from('tickets').select('*', { count: 'exact', head: false }).gte('created_at', weekStart),
    supabase.from('messages').select('*', { count: 'exact', head: false }).gte('created_at', weekStart),
  ])

  return NextResponse.json({
    success: true,
    period: { start: weekStart, end: new Date().toISOString() },
    summary: {
      newBookings: bookingsRes.count || 0,
      newTickets: ticketsRes.count || 0,
      newMessages: messagesRes.count || 0,
    },
  })
}
