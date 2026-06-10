import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { name, email, message } = body
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      name: name || '',
      email: email || '',
      message,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { id, read } = body
  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .update({ read: read ?? true })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
