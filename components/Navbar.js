'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [inPurpleSection, setInPurpleSection] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))

    const handleScroll = () => {
      // Float state
      if (window.scrollY > 5) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Check if current scroll position overlaps any element with purple backgrounds
      const sections = ['#showdown', '#process', '#questionnaire', '#why-cyzora']
      let activePurple = false
      for (const selector of sections) {
        const el = document.querySelector(selector)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the top 70px of viewport is inside this section
          if (rect.top <= 64 && rect.bottom >= 0) {
            activePurple = true
            break
          }
        }
      }
      setInPurpleSection(activePurple)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function toggleTheme() {
    const html = document.documentElement
    const nowDark = html.classList.toggle('dark')
    setIsDark(nowDark)
    localStorage.setItem('cyzora-theme', nowDark ? 'dark' : 'light')
  }

  const links = [
    { label: 'Services', href: '/#services' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Book a Call', href: '/#booking' },
  ]

  // Decide text colors based on section contrast
  const textColor = inPurpleSection ? '#e9d5ff' : 'var(--textLight)'
  const mutedTextColor = inPurpleSection ? '#d8b4fe' : 'var(--textGray)'
  const brandColor = inPurpleSection ? '#f5f3ff' : 'var(--textLight)'
  const borderRule = inPurpleSection ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--border)'

  return (
    <>
      {/* Top Banner Ticker */}
      <div 
        className="w-full text-center py-2 px-4 text-xs font-bold relative z-50 flex items-center justify-center overflow-hidden border-b"
        style={{ 
          background: 'linear-gradient(90deg, rgb(var(--accent-rgb)) 0%, #7c3aed 100%)', 
          borderColor: 'rgba(255,255,255,0.1)',
          color: '#ffffff'
        }}
      >
        <div className="animate-marquee whitespace-nowrap flex gap-4">
          <span>Your Brand, your voice, your website ... we just bring it to life .... Kenya's best website and app developers creating amazing beautiful websites since 2020 ✦ We build your website, your way.</span>
        </div>
      </div>

      <nav 
        className={`sticky z-50 transition-all duration-300 backdrop-blur-xl ${
          scrolled ? 'top-4 max-w-6xl mx-4 md:mx-auto left-0 right-0 rounded-2xl shadow-xl floating-nav' : 'top-0 w-full'
        }`} 
        style={{ 
          background: inPurpleSection 
            ? 'rgba(15, 10, 30, 0.7)' 
            : 'var(--nav-bg, rgba(255,255,255,0.25))', 
          borderBottom: borderRule,
          boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.15)' : 'none'
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <svg className="w-6 h-6 transform group-hover:scale-105 transition-all duration-300" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" style={{ color: inPurpleSection ? '#c084fc' : 'rgb(var(--accent-rgb))', stroke: 'currentColor' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: brandColor }}>cyzora<span style={{ color: inPurpleSection ? '#a78bfa' : 'rgb(var(--accent-rgb))' }}>.</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:underline decoration-2 underline-offset-4 transition-all" 
                style={{ 
                  color: mutedTextColor,
                  textDecorationColor: inPurpleSection ? '#c084fc' : 'rgb(var(--accent-rgb))' 
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="theme-btn" 
              style={{ color: mutedTextColor, borderColor: inPurpleSection ? 'rgba(255,255,255,0.2)' : 'var(--border)' }} 
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>

            <a href="/#booking" className="hidden md:inline text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all active:scale-95 shadow-lg" style={{ background: inPurpleSection ? '#7c3aed' : 'rgb(var(--accent-rgb))', boxShadow: '0 8px 24px var(--glow)' }}>
              Schedule Meeting
            </a>

            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X size={24} style={{ color: textColor }} /> : <Menu size={24} style={{ color: textColor }} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 top-24 z-40 flex flex-col items-center justify-center gap-6 md:hidden" style={{ background: inPurpleSection ? '#0f0a1e' : 'var(--bg)' }}>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider transition-colors" 
                style={{ color: mutedTextColor }}
              >
                {link.label}
              </Link>
            ))}
            <a href="/#booking" onClick={() => setMobileOpen(false)} className="text-white text-xs font-bold px-6 py-3 rounded-lg transition-all" style={{ background: inPurpleSection ? '#7c3aed' : 'rgb(var(--accent-rgb))' }}>
              Schedule Meeting
            </a>
            <button onClick={toggleTheme} className="theme-btn mt-4">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
