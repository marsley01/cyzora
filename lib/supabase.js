import { createBrowserClient } from '@supabase/ssr'

const mockClient = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Not configured' } }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Not configured' } }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Not configured' } }) }),
    order: () => Promise.resolve({ data: [], error: null }),
    eq: () => ({
      single: () => Promise.resolve({ data: null, error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    single: () => Promise.resolve({ data: null, error: null }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    subscribe: () => {},
  }),
  removeChannel: () => {},
}

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mockClient
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
