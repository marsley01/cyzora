import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = params

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request, { params }) {
  const supabase = await createClient()
  const { id } = params
  const body = await request.json()

  const updates = {}
  if (body.status) updates.status = body.status
  if (body.priority) updates.priority = body.priority
  if (body.subject) updates.subject = body.subject
  if (body.description) updates.description = body.description
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
