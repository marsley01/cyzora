import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'All') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { client_name, client_email, subject, description, priority } = body

  if (!client_name || !subject) {
    return NextResponse.json({ error: 'Client name and subject are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tickets')
    .insert({
      client_name,
      client_email: client_email || '',
      subject,
      description: description || '',
      priority: priority || 'Medium',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
