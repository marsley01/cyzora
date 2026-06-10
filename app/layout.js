'use client'

import { useEffect, useState, useRef } from 'react'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import { Phone, Mail, MessageSquare, X, Send } from 'lucide-react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  // Custom cursor refs and state
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('cyzora-theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Custom cursor movement logic
    const onMouseMove = (e) => {
      if (dotRef.current && ringRef.current) {
        // Dot moves instantly
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`
        // Ring moves with animation/delay using smooth transitions or GSAP in page/layout. We can use quick CSS transition on the ring.
        ringRef.current.style.transform = `translate3d(${e.clientX - 18}px, ${e.clientY - 18}px, 0)`
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  async function handleModalSubmit(e) {
    e.preventDefault()
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message: msg }),
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setMsg('')
      setModalOpen(false)
    }, 2500)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Cyzora Tech — Premium Web Design & Development Agency</title>
        <meta name="description" content="Nairobi-based web agency building custom websites, stores, and platforms for Kenyan & East African brands." />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var saved = localStorage.getItem('cyzora-theme');
              if (saved === 'dark') {
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
      </head>
      <body className={`${inter.className} antialiased`} style={{ color: 'var(--textLight)', background: 'var(--bg)' }}>
        {/* Custom cursor markup */}
        <div ref={dotRef} className="custom-cursor-dot" />
        <div ref={ringRef} className="custom-cursor-ring" />

        <div id="parallax-bg"></div>
        <div id="parallax-overlay"></div>
        <div className="relative z-10">
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <ChatBot />
        </div>

        {/* Floating "Talk to Us" Button */}
        <div className="fixed bottom-28 right-7 z-50">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full text-white font-bold text-xs shadow-xl hover:scale-105 transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--accent-rgb)), #7c3aed)',
              boxShadow: '0 8px 32px var(--glow)'
            }}
          >
            <MessageSquare size={16} className="animate-pulse" />
            <span>Talk to Us</span>
          </button>
        </div>

        {/* Contacts Modal View */}
        {modalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div 
              className="relative w-full max-w-lg rounded-3xl p-8 overflow-hidden shadow-2xl transition-all duration-300 scale-100"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                style={{ color: 'var(--textGray)' }}
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgb(var(--accent-rgb))' }}>Direct Connection</span>
                  <h3 className="text-2xl font-extrabold tracking-tight mt-1" style={{ color: 'var(--textLight)' }}>Let's Create Your Way</h3>
                  <p className="text-xs mt-2" style={{ color: 'var(--textGray)' }}>Get in touch directly via call, email, or by leaving a quick message. We usually reply in under an hour.</p>
                </div>

                {/* Direct Contacts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href="mailto:hi@cyzorastudio.com"
                    className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:brightness-105"
                    style={{ background: 'var(--grayDark)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-brand-accent-faint text-[rgb(var(--accent-rgb))]">
                      <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--textGray)' }}>Email Us</p>
                      <p className="text-xs font-bold truncate" style={{ color: 'var(--textLight)' }}>hi@cyzorastudio.com</p>
                    </div>
                  </a>

                  <a 
                    href="tel:0758335592"
                    className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:brightness-105"
                    style={{ background: 'var(--grayDark)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-brand-accent-faint text-[rgb(var(--accent-rgb))]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--textGray)' }}>Call Admin</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--textLight)' }}>0758 335 592</p>
                    </div>
                  </a>

                  <a 
                    href="tel:0749610772"
                    className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:brightness-105"
                    style={{ background: 'var(--grayDark)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-brand-accent-faint text-[rgb(var(--accent-rgb))]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--textGray)' }}>Call Sales</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--textLight)' }}>0749 610 772</p>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/254758335592"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:brightness-105"
                    style={{ background: 'var(--grayDark)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-500">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--textGray)' }}>WhatsApp</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--textLight)' }}>Instant Chat</p>
                    </div>
                  </a>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  {submitted ? (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-sm font-bold" style={{ color: 'rgb(var(--accent-rgb))' }}>Message Sent Successfully!</p>
                      <p className="text-xs" style={{ color: 'var(--textGray)' }}>We will get back to you shortly at your registered email address.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleModalSubmit} className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--textGray)' }}>Or Send A Quick Message</p>
                      <input 
                        type="text" 
                        required 
                        placeholder="Your Name / Company"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-xs focus:outline-none" 
                        style={{ background: 'var(--grayDark)', color: 'var(--textLight)', border: '1px solid var(--border)' }} 
                      />
                      <textarea 
                        required 
                        placeholder="How can we help you today?" 
                        rows={3}
                        value={msg} 
                        onChange={(e) => setMsg(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-xs focus:outline-none resize-none" 
                        style={{ background: 'var(--grayDark)', color: 'var(--textLight)', border: '1px solid var(--border)' }} 
                      />
                      <button 
                        type="submit"
                        className="w-full text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                        style={{ background: 'rgb(var(--accent-rgb))' }}
                      >
                        <Send size={14} />
                        <span>Submit Message</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  )
}
