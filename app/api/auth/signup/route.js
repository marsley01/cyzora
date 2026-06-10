import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name || '' } },
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  if (!authData.user) return NextResponse.json({ error: 'User creation failed' }, { status: 500 })

  const { error: adminError } = await supabase.from('admins').insert({
    id: authData.user.id,
    email,
    name: name || email.split('@')[0],
  })

  if (adminError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: adminError.message }, { status: 500 })
  }

  return NextResponse.json({ user: authData.user, message: 'Check your email to confirm your account' }, { status: 201 })
}
