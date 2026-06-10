import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session')

  let query = supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { sessionId, messages } = body

  if (!sessionId || !messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'sessionId and messages array required' }, { status: 400 })
  }

  // Upsert: delete existing messages for this session and re-insert
  const { error: delError } = await supabase
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId)

  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

  const rows = messages.map((msg, i) => ({
    session_id: sessionId,
    role: msg.role,
    text: msg.text,
  }))

  const { error: insError } = await supabase.from('chat_messages').insert(rows)
  if (insError) return NextResponse.json({ error: insError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
