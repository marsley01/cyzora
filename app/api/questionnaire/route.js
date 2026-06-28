import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 5 })

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questionnaires')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const { allowed, retryAfter } = limiter(request)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } })
  }

  const supabase = await createClient()
  const body = await request.json()

  const { name, email, siteType, payment, content, timeline, packageName } = body

  if (!siteType || !payment || !content || !timeline) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('questionnaires')
    .insert({
      name: name || '',
      email: email || '',
      site_type: siteType,
      payment,
      content,
      timeline,
      package_name: packageName || 'Silver',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
