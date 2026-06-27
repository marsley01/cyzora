import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 10 })

export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = params

  const { data, error } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request, { params }) {
  const { allowed, retryAfter } = limiter(request)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } })
  }

  const supabase = await createClient()
  const { id } = params
  const body = await request.json()

  if (!body.message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('ticket_messages')
    .insert({
      ticket_id: parseInt(id),
      sender: body.sender || 'admin',
      message: body.message,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
