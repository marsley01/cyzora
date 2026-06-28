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
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: staleTickets, error } = await supabase
    .from('tickets')
    .update({ status: 'Resolved', updated_at: new Date().toISOString() })
    .eq('status', 'In Progress')
    .lt('updated_at', weekAgo)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    autoResolved: staleTickets?.length || 0,
    tickets: staleTickets || [],
  })
}
