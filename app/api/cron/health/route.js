import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const authHeader = process.env.CRON_SECRET
    ? request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
    : true

  if (!authHeader && process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const checks = { uptime: process.uptime(), timestamp: new Date().toISOString() }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('admins').select('id').limit(1)
    checks.database = error ? `error: ${error.message}` : 'ok'
  } catch (err) {
    checks.database = `error: ${err.message}`
  }

  const status = checks.database === 'ok' ? 200 : 503
  return NextResponse.json({ status: status === 200 ? 'healthy' : 'degraded', ...checks }, { status })
}
