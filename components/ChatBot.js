'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, ArrowUp, Loader2 } from 'lucide-react'

const quickReplies = ['What are your prices?', 'Show me your work', 'How do I start?', 'Do you do M-Pesa?']

function getSessionId() {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('cyzora-chat-session')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('cyzora-chat-session', id)
  }
  return id
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const sessionId = getSessionId()

  useEffect(() => {
    if (!open) return
    const saved = localStorage.getItem('cyzora-chat-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed)
        const lastRole = parsed.length > 0 ? parsed[parsed.length - 1].role : null
        setShowQuickReplies(lastRole === 'assistant')
      } catch {}
    } else {
      const greeting = { role: 'assistant', text: "Hi there! I'm your Cyzora agent. I'd love to help you with web design, development, or anything else — just ask!" }
      setMessages([greeting])
      setShowQuickReplies(true)
    }
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  function persistMessages(updatedMessages) {
    localStorage.setItem('cyzora-chat-history', JSON.stringify(updatedMessages))
    fetch('/api/messages/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, messages: updatedMessages }),
    }).catch(() => {})
  }

  function saveToMessages(text) {
    const key = 'cyzora-msg-saved'
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Chat Visitor', message: `Chat: ${text}` }),
    }).catch(() => {})
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function getAIResponse(text) {
    if (text.toLowerCase().includes('how do i start') || text.toLowerCase().includes('how to start')) {
      setWaiting(true)
      await new Promise(r => setTimeout(r, 600))
      setWaiting(false)
      setShowQuickReplies(true)
      return "It's super easy! We always begin with a quick 15-minute Zoom or phone call to understand your core feature set, design guidelines, and timeline. You can scroll down to the 'Schedule A Strategy Consultation' section to book your slot right now. Want me to help you pick a package?"
    }

    setWaiting(true)
    setShowQuickReplies(false)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      return data.reply || "Let me connect you with our team — email hi@cyzorastudio.com or call 0740 610 772 and someone will get back to you right away."
    } catch {
      return "Let me connect you with our team — email hi@cyzorastudio.com or call 0740 610 772 and someone will get back to you right away."
    } finally {
      setWaiting(false)
    }
  }

  async function handleSend(text) {
    const msg = text || input
    if (!msg.trim() || waiting) return

    const userMsg = { role: 'user', text: msg }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    persistMessages(updated)
    saveToMessages(msg)

    const reply = await getAIResponse(msg)
    const botMsg = { role: 'assistant', text: reply }
    const final = [...updated, botMsg]
    setMessages(final)
    setShowQuickReplies(true)
    persistMessages(final)
  }

  async function handleQuickReply(reply) {
    if (waiting) return
    const userMsg = { role: 'user', text: reply }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setShowQuickReplies(false)
    persistMessages(updated)
    saveToMessages(reply)

    const botReply = await getAIResponse(reply)
    const botMsg = { role: 'assistant', text: botReply }
    const final = [...updated, botMsg]
    setMessages(final)
    setShowQuickReplies(true)
    persistMessages(final)
  }

  return (
    <div className="fixed z-[999]" style={{ bottom: '28px', right: '28px' }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute bottom-16 right-0 rounded-xl border shadow-2xl flex flex-col"
            style={{
              width: '360px',
              height: '500px',
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            <div className="h-14 border-b flex items-center px-4 shrink-0" style={{ borderColor: 'var(--border)' }}>
              <span className="w-2 h-2 rounded-full bg-primary pulse-dot mr-3" />
              <div className="flex-1">
                <div className="font-body text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Cyzora Assistant
                </div>
                <div className="font-body text-xs text-zinc-500 dark:text-zinc-400">
                  AI-powered · Ask me anything
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`font-body text-sm px-3.5 py-2.5 max-w-[80%] leading-relaxed ${msg.role !== 'user' ? 'text-zinc-900 dark:text-zinc-100' : ''}`}
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, #673DE0, #8B5CF6)',
                            color: 'white',
                            borderRadius: '12px 0 12px 12px',
                          }
                        : {
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '0 12px 12px 12px',
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {waiting && (
                <div className="flex justify-start">
                  <div className="font-body text-sm px-4 py-3" style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--muted)',
                    borderRadius: '0 12px 12px 12px',
                  }}>
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}

              {showQuickReplies && !waiting && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="font-body text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="h-14 border-t flex items-center px-3 gap-2 shrink-0" style={{ borderColor: 'var(--border)' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about services, pricing..."
                className="flex-1 font-body text-sm bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                disabled={waiting}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || waiting}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
                style={{
                  background: '#673DE0',
                  color: 'white',
                  opacity: input.trim() && !waiting ? 1 : 0.4,
                }}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #673DE0, #8B5CF6)',
          boxShadow: '0 8px 32px rgba(103,61,224,0.4)',
        }}
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  )
}
