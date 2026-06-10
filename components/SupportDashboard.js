'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Ticket, DollarSign,
  Globe, Settings, Bell, Send, X, Search,
  LogOut, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: MessageSquare },
  { id: 'questionnaires', label: 'Scopes', icon: Ticket },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function SupportDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const [bookings, setBookings] = useState([])
  const [questionnaires, setQuestionnaires] = useState([])
  const [tickets, setTickets] = useState([])
  const [ticketMessages, setTicketMessages] = useState({})
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState({ tickets: 0, newMessages: 0, quotesPending: 0, activeSites: 0 })

  const [ticketFilter, setTicketFilter] = useState('All')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketReply, setTicketReply] = useState('')

  const [expandedBooking, setExpandedBooking] = useState(null)
  const [expandedScope, setExpandedScope] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/admin/login'); return }
      setUser(user)
      supabase.from('admins').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setAdmin(data)
        setLoading(false)
      })
    })
  }, [])

  const fetchData = useCallback(async () => {
    const [b, q, t, m] = await Promise.all([
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/questionnaire').then(r => r.json()),
      fetch('/api/tickets').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()),
    ])
    if (!b.error) setBookings(b)
    if (!q.error) setQuestionnaires(q)
    if (!t.error) setTickets(t)
    if (!m.error) setMessages(m)

    setStats({
      tickets: Array.isArray(t) ? t.filter(tk => tk.status !== 'Resolved').length : 0,
      newMessages: Array.isArray(m) ? m.filter(msg => !msg.read).length : 0,
      quotesPending: Array.isArray(q) ? q.filter(s => !s.quoted).length : 0,
      activeSites: 6,
    })
  }, [])

  useEffect(() => {
    if (!loading && user) fetchData()
  }, [loading, user, fetchData])

  // Subscribe to realtime changes
  useEffect(() => {
    if (!user) return

    const channel = supabase.channel('admin-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questionnaires' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, fetchData])

  async function loadTicketMessages(ticketId) {
    if (ticketMessages[ticketId]) return
    const res = await fetch(`/api/tickets/${ticketId}/messages`)
    const data = await res.json()
    if (!data.error) setTicketMessages(prev => ({ ...prev, [ticketId]: data }))
  }

  async function handleTicketReply(ticketId) {
    if (!ticketReply.trim()) return
    await fetch(`/api/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: ticketReply, sender: 'admin' }),
    })
    setTicketReply('')
    fetchData()
    loadTicketMessages(ticketId)
  }

  async function updateTicketStatus(ticketId, status) {
    await fetch(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchData()
    setSelectedTicket(prev => prev && prev.id === ticketId ? { ...prev, status } : prev)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="font-body text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>
      </div>
    )
  }

  function StatCard({ number, label, dotColor }) {
    return (
      <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display text-4xl font-bold" style={{ color: '#673DE0' }}>{number}</span>
          <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
        </div>
        <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 fixed left-0 top-0 h-full z-20 pt-16" style={{ background: 'var(--surface)' }}>
        <div className="p-6">
          <div className="font-display text-lg font-extrabold" style={{ color: 'var(--text)' }}>CyzoraTech</div>
        </div>
        <nav className="px-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedTicket(null) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-body text-sm transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(103,61,224,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #673DE0' : '3px solid transparent',
                  color: isActive ? 'var(--text)' : 'var(--muted)',
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </nav>
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-semibold text-white" style={{ background: '#673DE0' }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{admin?.name || 'Admin'}</div>
              <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 font-body text-sm" style={{ color: 'var(--muted)' }}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
              {activeTab === 'overview' ? `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${admin?.name || 'Admin'} 👋` : ''}
              {activeTab === 'bookings' ? 'Consultation Bookings' : ''}
              {activeTab === 'questionnaires' ? 'Project Scopes' : ''}
              {activeTab === 'tickets' ? 'Support Tickets' : ''}
              {activeTab === 'messages' ? 'Messages' : ''}
              {activeTab === 'settings' ? 'Settings' : ''}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="flex items-center gap-1 font-body text-xs" style={{ color: 'var(--muted)' }}>
              <RefreshCw size={14} />
              Refresh
            </button>
            <Bell size={20} style={{ color: 'var(--muted)' }} className="cursor-pointer" />
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-body text-sm font-semibold text-white" style={{ background: '#673DE0' }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard number={stats.tickets} label="Open Tickets" dotColor="#EF4444" />
              <StatCard number={stats.newMessages} label="New Messages" dotColor="#22C55E" />
              <StatCard number={stats.quotesPending} label="Pending Scopes" dotColor="#F59E0B" />
              <StatCard number={stats.activeSites} label="Active Sites" dotColor="#673DE0" />
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Recent Bookings</h2>
              <div className="space-y-0">
                {bookings.slice(0, 5).map((b, i) => (
                  <div key={b.id} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                    <span className="font-body text-sm flex-1" style={{ color: 'var(--text)' }}>
                      {b.name} booked a <strong>{b.call_type === 'zoom' ? 'Zoom' : 'Phone'} call</strong> — {b.package_name} Package
                    </span>
                    <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="font-body text-sm py-4" style={{ color: 'var(--muted)' }}>No bookings yet.</div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Recent Questionnaires</h2>
              <div className="space-y-0">
                {questionnaires.slice(0, 5).map((q, i) => (
                  <div key={q.id} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
                    <span className="font-body text-sm flex-1" style={{ color: 'var(--text)' }}>
                      {q.siteType} — {q.timeline}
                    </span>
                    <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {questionnaires.length === 0 && (
                  <div className="font-body text-sm py-4" style={{ color: 'var(--muted)' }}>No questionnaires yet.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 && (
              <div className="font-body text-sm py-8 text-center" style={{ color: 'var(--muted)' }}>No bookings yet.</div>
            )}
            {bookings.map((b) => (
              <div key={b.id} className="rounded-xl p-5 cursor-pointer transition-all" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                onClick={() => setExpandedBooking(expandedBooking === b.id ? null : b.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{b.name}</span>
                    <span className="font-body text-xs ml-3" style={{ color: 'var(--muted)' }}>{b.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs px-2.5 py-1 rounded-md" style={{ background: b.call_type === 'zoom' ? 'rgba(103,61,224,0.1)' : 'rgba(34,197,94,0.1)', color: b.call_type === 'zoom' ? '#673DE0' : '#22C55E' }}>
                      {b.call_type === 'zoom' ? 'Zoom' : 'Phone'}
                    </span>
                    <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedBooking === b.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 pt-4 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid var(--border)' }}>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Package</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{b.package_name}</div>
                        </div>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Date</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{b.date}</div>
                        </div>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Time</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{b.time}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* QUESTIONNAIRES */}
        {activeTab === 'questionnaires' && (
          <div className="space-y-3">
            {questionnaires.length === 0 && (
              <div className="font-body text-sm py-8 text-center" style={{ color: 'var(--muted)' }}>No questionnaires yet.</div>
            )}
            {questionnaires.map((q) => (
              <div key={q.id} className="rounded-xl p-5 cursor-pointer transition-all" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                onClick={() => setExpandedScope(expandedScope === q.id ? null : q.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{q.name || 'Anonymous'}</span>
                    {q.email && <span className="font-body text-xs ml-3" style={{ color: 'var(--muted)' }}>{q.email}</span>}
                  </div>
                  <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>{new Date(q.created_at).toLocaleDateString()}</span>
                </div>
                <AnimatePresence>
                  {expandedScope === q.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 pt-4 grid grid-cols-2 gap-4" style={{ borderTop: '1px solid var(--border)' }}>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Site Type</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{q.site_type}</div>
                        </div>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Payment</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{q.payment}</div>
                        </div>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Content</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{q.content}</div>
                        </div>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Timeline</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{q.timeline}</div>
                        </div>
                        <div>
                          <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Package</div>
                          <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{q.package_name}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* TICKETS */}
        {activeTab === 'tickets' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {['All', 'Open', 'In Progress', 'Resolved'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTicketFilter(f)}
                    className="font-body text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
                    style={{
                      background: ticketFilter === f ? '#673DE0' : 'var(--card)',
                      color: ticketFilter === f ? 'white' : 'var(--muted)',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full font-body text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Client', 'Subject', 'Priority', 'Status', 'Date', 'Action'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 font-semibold uppercase tracking-widest text-xs" style={{ color: 'var(--muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.filter((t) => ticketFilter === 'All' || t.status === ticketFilter).map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onClick={() => { setSelectedTicket(ticket); loadTicketMessages(ticket.id) }}
                    >
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>#{ticket.id}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--text)' }}>{ticket.client_name}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>{ticket.subject}</td>
                      <td className="py-3 px-4 font-semibold text-xs" style={{ color: ticket.priority === 'High' ? '#EF4444' : ticket.priority === 'Medium' ? '#F59E0B' : 'var(--muted)' }}>{ticket.priority}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: ticket.status === 'Open' ? '#22C55E' : ticket.status === 'In Progress' ? '#673DE0' : 'var(--muted)' }}>{ticket.status}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>{new Date(ticket.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: '#673DE0' }}>View →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AnimatePresence>
              {selectedTicket && (
                <motion.div
                  initial={{ x: 300 }}
                  animate={{ x: 0 }}
                  exit={{ x: 300 }}
                  className="fixed right-0 top-0 h-full w-96 z-30 pt-16 shadow-2xl"
                  style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedTicket.subject}</span>
                    <button onClick={() => setSelectedTicket(null)}><X size={18} style={{ color: 'var(--muted)' }} /></button>
                  </div>

                  <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Client</div>
                      <div className="font-body text-sm font-medium" style={{ color: 'var(--text)' }}>{selectedTicket.client_name}</div>
                      {selectedTicket.client_email && (
                        <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>{selectedTicket.client_email}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Description</div>
                      <div className="font-body text-sm mt-1" style={{ color: 'var(--text)' }}>{selectedTicket.description}</div>
                    </div>
                    <div className="flex gap-2">
                      {['Open', 'In Progress', 'Resolved'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateTicketStatus(selectedTicket.id, s)}
                          className="font-body text-xs px-2.5 py-1 rounded-md"
                          style={{
                            background: selectedTicket.status === s ? '#673DE0' : 'var(--card)',
                            color: selectedTicket.status === s ? 'white' : 'var(--muted)',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
                    <div className="font-body text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Conversation</div>
                    {(ticketMessages[selectedTicket.id] || []).map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className="font-body text-sm px-3.5 py-2.5 max-w-[80%]" style={{
                          background: msg.sender === 'admin' ? 'linear-gradient(135deg, #673DE0, #8B5CF6)' : 'var(--card)',
                          color: msg.sender === 'admin' ? 'white' : 'var(--text)',
                          borderRadius: msg.sender === 'admin' ? '14px 0 14px 14px' : '0 14px 14px 14px',
                          border: msg.sender === 'admin' ? 'none' : '1px solid var(--border)',
                        }}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <textarea
                        value={ticketReply}
                        onChange={(e) => setTicketReply(e.target.value)}
                        placeholder="Type your reply..."
                        rows={1}
                        className="flex-1 font-body text-sm p-3 rounded-xl outline-none resize-none"
                        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTicketReply(selectedTicket.id) } }}
                      />
                      <button
                        onClick={() => handleTicketReply(selectedTicket.id)}
                        className="p-2.5 rounded-lg text-white"
                        style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="font-body text-sm py-8 text-center" style={{ color: 'var(--muted)' }}>No messages yet.</div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)', opacity: msg.read ? 0.6 : 1 }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{msg.name || 'Anonymous'}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full" style={{ background: '#673DE0' }} />}
                  </div>
                  <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                {msg.email && <div className="font-body text-xs mb-2" style={{ color: 'var(--muted)' }}>{msg.email}</div>}
                <div className="font-body text-sm" style={{ color: 'var(--text)' }}>{msg.message}</div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-lg">
            <h2 className="font-display text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>Account Settings</h2>
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: admin?.name || '' },
                { label: 'Email', value: admin?.email || '' },
                { label: 'Role', value: 'Admin' },
              ].map((field, i) => (
                <div key={i}>
                  <label className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{field.label}</label>
                  <input
                    defaultValue={field.value}
                    className="w-full font-body text-sm p-3 rounded-xl outline-none mt-1"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    readOnly={field.label === 'Role'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
