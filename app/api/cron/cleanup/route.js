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
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const results = {}

  const tables = ['chat_messages', 'messages', 'ticket_messages']
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .lt('created_at', cutoff)

    results[table] = error ? `error: ${error.message}` : `${data?.length || 0} rows deleted`
  }

  return NextResponse.json({ success: true, cleaned: results })
}
