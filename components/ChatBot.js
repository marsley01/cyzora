'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, ArrowUp } from 'lucide-react'

const botResponses = {
  'Website': "Great! We build custom, WordPress, and Wix sites. What's your budget range?",
  'Shopify Store': "We can build a full Shopify store or set you up on Cyzora Store with M-Pesa built in. Which interests you?",
  'Portal': "Business portals start at KSh 150,000. What kind of portal do you need?",
  'Pricing': "Check our full pricing at cyzoratech.com/pricing or tell me your project and I'll estimate it for you.",
}

const quickReplies = ['Website', 'Shopify Store', 'Portal', 'Pricing']

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: "Hi! I'm the CyzoraTech assistant. What are you looking to build?" }])
      setShowQuickReplies(true)
    }
  }, [open, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(text) {
    const msg = text || input
    if (!msg.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    setShowQuickReplies(false)

    setTimeout(() => {
      const reply = botResponses[msg] || "Thanks for reaching out! Leave your email and we'll get back to you within 24 hours."
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
      if (botResponses[msg]) {
        setShowQuickReplies(false)
      } else {
        setShowQuickReplies(false)
      }
    }, 800)
  }

  function handleQuickReply(reply) {
    setMessages((prev) => [...prev, { role: 'user', text: reply }])
    setShowQuickReplies(false)

    setTimeout(() => {
      const replyText = botResponses[reply] || "Thanks for reaching out! Leave your email and we'll get back to you within 24 hours."
      setMessages((prev) => [...prev, { role: 'bot', text: replyText }])
    }, 800)
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
              width: '340px',
              height: '480px',
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            <div className="h-14 border-b flex items-center px-4 shrink-0" style={{ borderColor: 'var(--border)' }}>
              <span className="w-2 h-2 rounded-full bg-primary pulse-dot mr-3" />
              <div className="flex-1">
                <div className="font-body text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  CyzoraTech Support
                </div>
                <div className="font-body text-xs" style={{ color: 'var(--muted)' }}>
                  Usually replies in minutes
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1">
                <X size={18} style={{ color: 'var(--muted)' }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="font-body text-sm px-3.5 py-2.5 max-w-[80%]"
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
                            color: 'var(--text)',
                            borderRadius: '0 12px 12px 12px',
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {showQuickReplies && messages.length > 0 && messages[messages.length - 1].role === 'bot' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="font-body text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 hover:border-primary/50"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 font-body text-sm bg-transparent border-none outline-none"
                style={{ color: 'var(--text)' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
                style={{
                  background: '#673DE0',
                  color: 'white',
                  opacity: input.trim() ? 1 : 0.4,
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
