'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })

      if (err) {
        setError(err.message)
      } else {
        window.location.href = '/admin'
        return
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>Cyzora Design</div>
          <div className="font-body text-sm" style={{ color: 'var(--muted)' }}>Admin Dashboard</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-body text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cyzora.design"
              required
              className="w-full font-body text-sm p-3 rounded-xl outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block font-body text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full font-body text-sm p-3 rounded-xl outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          {error && (
            <div className="font-body text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-body font-semibold text-white rounded-xl py-3 text-sm transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
