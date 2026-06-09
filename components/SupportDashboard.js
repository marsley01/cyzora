'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Ticket, DollarSign,
  Globe, Settings, Bell, Send, Paperclip, X, Search,
  ChevronRight, LogOut
} from 'lucide-react'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'quotes', label: 'Quotes & Pricing', icon: DollarSign },
  { id: 'sites', label: 'Sites', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const recentActivity = [
  { icon: MessageSquare, text: 'New message from Achieng O.', time: '2 min ago' },
  { icon: Ticket, text: 'Ticket #1042 opened by Kamau W.', time: '15 min ago' },
  { icon: DollarSign, text: 'Quote requested by Njoki M.', time: '1 hr ago' },
  { icon: MessageSquare, text: 'New message from Otieno P.', time: '2 hrs ago' },
  { icon: Ticket, text: 'Ticket #1041 resolved', time: '3 hrs ago' },
  { icon: DollarSign, text: 'Quote accepted by Wanjiku K.', time: '5 hrs ago' },
  { icon: MessageSquare, text: 'New message from Muthoni G.', time: '6 hrs ago' },
  { icon: Ticket, text: 'Ticket #1040 assigned to Support', time: '8 hrs ago' },
]

const conversations = [
  { name: 'Achieng O.', initials: 'AO', preview: 'When can we expect the next update?', time: '2m', unread: true },
  { name: 'Kamau W.', initials: 'KW', preview: 'The dashboard looks great, thanks!', time: '15m', unread: false },
  { name: 'Njoki M.', initials: 'NM', preview: 'Can you add an export feature?', time: '1h', unread: true },
  { name: 'Otieno P.', initials: 'OP', preview: 'Payment has been processed.', time: '2h', unread: false },
  { name: 'Wanjiku K.', initials: 'WK', preview: 'We need another revision round.', time: '5h', unread: false },
]

const messagesData = {
  'Achieng O.': [
    { role: 'client', text: 'When can we expect the next update?' },
    { role: 'me', text: 'We are deploying the new version tomorrow. I will notify you once it is live.' },
    { role: 'client', text: 'Perfect, thank you!' },
  ],
}

const ticketsData = [
  { id: 1042, client: 'Kamau W.', subject: 'Login page not loading on mobile', priority: 'High', status: 'Open', date: '2025-06-09' },
  { id: 1041, client: 'Njoki M.', subject: 'M-Pesa integration timeout', priority: 'High', status: 'In Progress', date: '2025-06-08' },
  { id: 1040, client: 'Otieno P.', subject: 'Product images not syncing', priority: 'Medium', status: 'Open', date: '2025-06-07' },
  { id: 1039, client: 'Wanjiku K.', subject: 'Add WhatsApp sharing button', priority: 'Low', status: 'Resolved', date: '2025-06-06' },
  { id: 1038, client: 'Muthoni G.', subject: 'Dashboard stats incorrect', priority: 'Medium', status: 'In Progress', date: '2025-06-05' },
  { id: 1037, client: 'Achieng O.', subject: 'Change domain name', priority: 'Low', status: 'Resolved', date: '2025-06-04' },
]

const quotesData = [
  { client: 'Njoki M.', package: 'Standard — Agency', budget: 'KSh 60,000', date: '2025-06-09', status: 'New' },
  { client: 'Otieno P.', package: 'Growth — Store', budget: 'KSh 10,000', date: '2025-06-08', status: 'Quoted' },
  { client: 'Muthoni G.', package: 'Premium — Agency', budget: 'KSh 120,000', date: '2025-06-07', status: 'Accepted' },
  { client: 'Achieng O.', package: 'Starter — Agency', budget: 'KSh 30,000', date: '2025-06-06', status: 'Declined' },
]

const sitesData = [
  { name: 'Munchify', url: 'munchify.co.ke', status: 'Live', platform: 'Next.js' },
  { name: 'Edyfra', url: 'edyfra.com', status: 'Live', platform: 'Next.js' },
  { name: 'Belloria', url: 'belloria.co.ke', status: 'Live', platform: 'Shopify' },
  { name: 'Tanda Fresh', url: 'tandafresh.com', status: 'Under Development', platform: 'WordPress' },
  { name: 'Senti Invest', url: 'senti.co.ke', status: 'Under Development', platform: 'Custom' },
  { name: 'Nairobi Kitchen', url: 'nairobigrill.co.ke', status: 'Maintenance', platform: 'Wix' },
]

const priorityStyle = {
  High: { color: '#EF4444' },
  Medium: { color: '#F59E0B' },
  Low: { color: 'var(--muted)' },
}

const statusStyle = {
  Open: { color: '#22C55E' },
  'In Progress': { color: '#673DE0' },
  Resolved: { color: 'var(--muted)' },
}

const quoteStatusStyle = {
  New: { color: '#673DE0' },
  Quoted: { color: '#F59E0B' },
  Accepted: { color: '#22C55E' },
  Declined: { color: '#EF4444' },
}

const siteStatusColors = {
  Live: '#22C55E',
  'Under Development': '#F59E0B',
  Maintenance: '#673DE0',
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

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activeConv, setActiveConv] = useState('Achieng O.')
  const [ticketFilter, setTicketFilter] = useState('All')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  function getPriorityStyle(p) { return priorityStyle[p] || { color: 'var(--muted)' } }
  function getStatusStyle(s) { return statusStyle[s] || { color: 'var(--muted)' } }

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
                onClick={() => { setActiveTab(tab.id); setSelectedTicket(null); setSelectedQuote(null) }}
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
              M
            </div>
            <div>
              <div className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>Mash</div>
              <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Admin</div>
            </div>
          </div>
          <button className="flex items-center gap-2 font-body text-sm" style={{ color: 'var(--muted)' }}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Good morning, Mash 👋
          </h1>
          <div className="flex items-center gap-4">
            <Bell size={20} style={{ color: 'var(--muted)' }} className="cursor-pointer" />
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-body text-sm font-semibold text-white" style={{ background: '#673DE0' }}>
              M
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard number={12} label="Open Tickets" dotColor="#EF4444" />
              <StatCard number={4} label="New Messages" dotColor="#22C55E" />
              <StatCard number={7} label="Pending Quotes" dotColor="#F59E0B" />
              <StatCard number={23} label="Active Sites" dotColor="#673DE0" />
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Recent Activity</h2>
              <div className="space-y-0">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <item.icon size={16} color="#673DE0" />
                    <span className="font-body text-sm flex-1" style={{ color: 'var(--text)' }}>{item.text}</span>
                    <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'messages' && (
          <div className="flex gap-0 h-[calc(100vh-200px)] rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="w-2/5 flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
              <div className="p-3">
                <input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full font-body text-sm p-2.5 rounded-lg outline-none"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveConv(conv.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200"
                    style={{
                      background: activeConv === conv.name ? 'rgba(103,61,224,0.1)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (activeConv !== conv.name) e.currentTarget.style.background = 'var(--card-hover)' }}
                    onMouseLeave={(e) => { if (activeConv !== conv.name) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-body text-sm font-semibold text-white shrink-0" style={{ background: '#673DE0' }}>
                      {conv.initials}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{conv.name}</span>
                        <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>{conv.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm truncate flex-1" style={{ color: 'var(--muted)' }}>{conv.preview}</span>
                        {conv.unread && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#673DE0' }} />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-semibold text-white" style={{ background: '#673DE0' }}>
                  AO
                </div>
                <div className="flex-1">
                  <div className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{activeConv}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
                    <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>Online</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(messagesData[activeConv] || []).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="font-body text-sm px-3.5 py-2.5 max-w-[70%]"
                      style={
                        msg.role === 'me'
                          ? {
                              background: 'linear-gradient(135deg, #673DE0, #8B5CF6)',
                              color: 'white',
                              borderRadius: '14px 0 14px 14px',
                            }
                          : {
                              background: 'var(--card)',
                              border: '1px solid var(--border)',
                              color: 'var(--text)',
                              borderRadius: '0 14px 14px 14px',
                            }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--border)' }}>
                <textarea
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 font-body text-sm p-3 rounded-xl outline-none resize-none"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
                <button className="p-2" style={{ color: 'var(--muted)' }}><Paperclip size={18} /></button>
                <button className="p-2.5 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

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
              <button
                className="font-body text-sm font-semibold px-4 py-2 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}
              >
                New Ticket
              </button>
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
                  {ticketsData.filter((t) => ticketFilter === 'All' || t.status === ticketFilter).map((ticket, i) => (
                    <tr
                      key={ticket.id}
                      className="cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>#{ticket.id}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--text)' }}>{ticket.client}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>{ticket.subject}</td>
                      <td className="py-3 px-4 font-semibold text-xs" style={getPriorityStyle(ticket.priority)}>{ticket.priority}</td>
                      <td className="py-3 px-4 text-xs" style={getStatusStyle(ticket.status)}>{ticket.status}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>{ticket.date}</td>
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
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Client</div>
                      <div className="font-body text-sm font-medium" style={{ color: 'var(--text)' }}>{selectedTicket.client}</div>
                    </div>
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Description</div>
                      <div className="font-body text-sm mt-1" style={{ color: 'var(--text)' }}>
                        Client reported an issue with {selectedTicket.subject.toLowerCase()}. Please investigate and provide a solution.
                      </div>
                    </div>
                    <textarea
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full font-body text-sm p-3 rounded-xl outline-none resize-none"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                      }}
                    />
                    <button
                      className="w-full font-body font-semibold text-white rounded-xl py-2.5 text-sm"
                      style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}
                    >
                      Reply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {activeTab === 'quotes' && (
          <>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full font-body text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Client', 'Package', 'Budget', 'Date', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 font-semibold uppercase tracking-widest text-xs" style={{ color: 'var(--muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quotesData.map((q, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onClick={() => setSelectedQuote(q)}
                    >
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--text)' }}>{q.client}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>{q.package}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--text)' }}>{q.budget}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--muted)' }}>{q.date}</td>
                      <td className="py-3 px-4 text-xs font-semibold" style={quoteStatusStyle[q.status] || { color: 'var(--muted)' }}>{q.status}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: '#673DE0' }}>View & Quote →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AnimatePresence>
              {selectedQuote && (
                <motion.div
                  initial={{ x: 300 }}
                  animate={{ x: 0 }}
                  exit={{ x: 300 }}
                  className="fixed right-0 top-0 h-full w-96 z-30 pt-16 shadow-2xl"
                  style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>{selectedQuote.client}</span>
                    <button onClick={() => setSelectedQuote(null)}><X size={18} style={{ color: 'var(--muted)' }} /></button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Package</div>
                      <div className="font-body text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{selectedQuote.package}</div>
                    </div>
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Budget</div>
                      <div className="font-body text-sm mt-0.5" style={{ color: 'var(--text)' }}>{selectedQuote.budget}</div>
                    </div>
                    <div>
                      <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>Your quoted price: KSh</div>
                      <input
                        placeholder="Enter amount"
                        className="w-full font-body text-sm p-3 rounded-xl outline-none mt-1"
                        style={{
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="Notes..."
                      rows={3}
                      className="w-full font-body text-sm p-3 rounded-xl outline-none resize-none"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                      }}
                    />
                    <button
                      className="w-full font-body font-semibold text-white rounded-xl py-2.5 text-sm"
                      style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}
                    >
                      Send Quote
                    </button>
                    <button
                      className="w-full font-body font-semibold rounded-xl py-2.5 text-sm"
                      style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                    >
                      Mark as Declined
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {activeTab === 'sites' && (
          <div className="grid grid-cols-3 gap-4">
            {sitesData.map((site, i) => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text)' }}>{site.name}</h3>
                <p className="font-body text-sm mt-1" style={{ color: 'var(--muted)' }}>{site.url}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: siteStatusColors[site.status] || '#8888AA' }} />
                  <span className="font-body text-xs" style={{ color: 'var(--muted)' }}>{site.status}</span>
                </div>
                <p className="font-body text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--muted)' }}>{site.platform}</p>
                <p className="font-body text-sm mt-4" style={{ color: '#673DE0' }}>Manage →</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-lg">
            <h2 className="font-display text-lg font-bold mb-6" style={{ color: 'var(--text)' }}>Account Settings</h2>
            <div className="space-y-4">
              {[
                { label: 'Full Name', value: 'Mash' },
                { label: 'Email', value: 'mash@cyzoratech.com' },
                { label: 'Role', value: 'Admin' },
              ].map((field, i) => (
                <div key={i}>
                  <label className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{field.label}</label>
                  <input
                    defaultValue={field.value}
                    className="w-full font-body text-sm p-3 rounded-xl outline-none mt-1"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
              ))}
              <button
                className="font-body font-semibold text-white rounded-xl py-2.5 px-6 text-sm"
                style={{ background: 'linear-gradient(135deg, #673DE0, #8B5CF6)' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
