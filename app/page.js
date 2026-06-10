'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import FadeUp from '@/components/FadeUp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const services = [
  { name: 'Bespoke Custom Web Design', desc: 'Stunning, customized visuals designed around your brand guidelines. Fully mobile-responsive layouts tailored to lock in immediate customer trust.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V5z M4 9h16 M8 14h2 M14 14h2" /></svg> },
  { name: 'Premium Custom Applications', desc: 'Expert-tier, lightweight bespoke systems optimized for lightning-fast speeds. Includes custom administration panels and intuitive content portals for simple editing.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { name: 'SEO & Conversion Optimization', desc: 'Structured clean metadata and optimized schema implementations. We make sure your web pages load instantly and sit high on search engine rankings.', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
]

const plans = [
  { name: 'Bronze', price: '20,000', tagline: 'For new businesses going online', popular: false, features: ['5-page responsive website','Basic on-page SEO','Contact form integration','Mobile-friendly design','1 round of revisions','1 month of maintenance','Basic analytics setup','Social media integration'] },
  { name: 'Silver', price: '55,000', tagline: 'For growing brands ready to scale', popular: true, features: ['10-page responsive website','Advanced on-page SEO','Custom contact forms','Mobile-first design','3 rounds of revisions','2 months of maintenance','Advanced analytics & reporting','Basic e-commerce functionality','Content management system','Performance optimisation'] },
  { name: 'Gold', price: '99,000', tagline: 'For established brands going all in', popular: false, features: ['Up to 20-page website','On-page and off-page SEO','Google Maps integration','5 rounds of revisions','3 months of maintenance','Complete analytics setup',    'Full social media integration','Custom admin dashboard','AI chatbot integration','Priority support'] },
]

const portfolio = [
  { name: 'Trivo Kenya', desc: 'E-commerce portal for smartphone accessories', tags: ['Custom Web App','Tailwind CSS','M-Pesa IPN'], gradient: 'linear-gradient(135deg, #7c3aed20, #6d28d940)' },
  { name: 'PrimeCart Logistics', desc: 'Corporate portal with shipment tracking', tags: ['React','Tailwind CSS','Node.js API'], gradient: 'linear-gradient(135deg, #7c3aed20, #8b5cf640)' },
  { name: 'Belloria Beauty', desc: 'E-commerce store for premium beauty', tags: ['React Next.js','E-commerce API','M-Pesa'], gradient: 'linear-gradient(135deg, #6d28d930, #7c3aed50)' },
  { name: 'Munchify', desc: 'Food discovery & ordering platform', tags: ['Next.js','Tailwind CSS','M-Pesa API'], gradient: 'linear-gradient(135deg, #8b5cf620, #7c3aed40)' },
  { name: 'Edyfra Learning', desc: 'Social learning platform with courses', tags: ['React','Firebase','Tailwind CSS'], gradient: 'linear-gradient(135deg, #7c3aed15, #6d28d945)' },
  { name: 'Client Portal', desc: 'Secure dashboard with support ticketing', tags: ['Next.js','Supabase','Tailwind CSS'], gradient: 'linear-gradient(135deg, #a78bfa20, #7c3aed50)' },
]

const faqs = [
  { q: 'Do I have to buy my own hosting and domain?', a: 'We recommend and can arrange premium cloud hosting tailored to your site\'s needs. For the Bronze plan, you can use your own hosting. Our Silver and Gold plans include optimized hosting setup with CDN and daily backups.' },
  { q: 'Can I easily edit my own text and images later?', a: 'Absolutely. We build your site on a custom, user-friendly CMS dashboard with an intuitive editor — so you can update text, images, and even add new pages without touching a line of code. We also provide a quick walkthrough video after launch.' },
  { q: 'How do revisions work?', a: 'Each package includes a set number of revision rounds (1 for Bronze, 3 for Silver, 5 for Gold). You submit feedback via our simple request form, and we implement changes within 2–3 business days. Additional revision rounds can be purchased separately.' },
  { q: 'Is there ongoing support after launch?', a: 'Yes! All plans include a maintenance period (1–3 months depending on the plan). After that, you can subscribe to our affordable monthly maintenance packages which include security updates, weekly backups, uptime monitoring, and priority email support.' },
  { q: 'What if I need M-Pesa integration on my site?', a: 'It\'s one of our specialities. We integrate M-Pesa C2B, Lipa Na M-Pesa, and STK Push directly into your e-commerce checkout flow or custom web application. We also support integrations with major Kenyan banks for a seamless local payment experience.' },
  { q: 'How fast will my custom site load?', a: 'Every Cyzora custom site scores 95+ on Google Lighthouse with sub-second load times. We use lightweight rendering methods, optimized databases, image compression, CDN integration, and advanced caching to ensure your site is among the fastest in your niche.' },
]

export default function HomePage() {
  // Speed showdown state
  const [isSpeedCyzora, setIsSpeedCyzora] = useState(false)

  // Questionnaire state
  const [qStep, setQStep] = useState(1)
  const [qData, setQData] = useState({ siteType: '', payment: '', content: '', timeline: '' })
  const [qPlan, setQPlan] = useState('Silver')

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null)

  // Booking state
  const [callType, setCallType] = useState('zoom')
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTime, setSelectedTime] = useState(0)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('Silver')
  const [confirmed, setConfirmed] = useState(false)
  const [bookingSending, setBookingSending] = useState(false)
  const [questionnaireSending, setQuestionnaireSending] = useState(false)

  const dates = [
    { day: 'Mon', date: 'Jun 15' },
    { day: 'Tue', date: 'Jun 16' },
    { day: 'Wed', date: 'Jun 17' },
    { day: 'Thu', date: 'Jun 18' },
  ]
  const times = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']

  function handleQSelect(key, value) {
    setQData(prev => ({ ...prev, [key]: value }))
  }

  function nextQStep(s) {
    if (s === 5 && !questionnaireSending) submitQuestionnaire()
    else setQStep(s)
  }
  function prevQStep(s) { setQStep(s) }

  const qReady = qData.siteType && qData.payment && qData.content && qData.timeline

  function toggleFaq(idx) { setOpenFaq(openFaq === idx ? null : idx) }

  async function submitBooking() {
    if (bookingSending) return
    setBookingSending(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          callType,
          packageName: selectedPlan,
          date: dates[selectedDate]?.date || '',
          time: times[selectedTime] || '',
        }),
      })
      if (res.ok) setConfirmed(true)
    } finally {
      setBookingSending(false)
    }
  }

  async function submitQuestionnaire() {
    if (questionnaireSending) return
    setQuestionnaireSending(true)
    try {
      await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteType: qData.siteType,
          payment: qData.payment,
          content: qData.content,
          timeline: qData.timeline,
          packageName: qPlan,
        }),
      })
    } finally {
      setQuestionnaireSending(false)
      setQStep(5)
    }
  }

  // GSAP refs
  const heroRef = useRef(null)
  const heroImageRef = useRef(null)
  const heroBadgeRef = useRef(null)
  const heroLine1Ref = useRef(null)
  const heroLine2Ref = useRef(null)
  const heroLine3Ref = useRef(null)
  const heroDescRef = useRef(null)
  const heroCtaRef = useRef(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Set initial states BEFORE timeline
      gsap.set(heroBadgeRef.current, { opacity: 0, y: 20 })
      gsap.set(heroDescRef.current, { opacity: 0, y: 30 })
      gsap.set(heroCtaRef.current, { opacity: 0, y: 30 })
      gsap.set(heroImageRef.current, { opacity: 0, x: 60, scale: 0.95 })

      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.3 })

      tl.to(heroBadgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      })
      .to(heroLine1Ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
      }, '-=0.2')
      .to(heroLine2Ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
      }, '-=0.55')
      .to(heroDescRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
      }, '-=0.4')
      .to(heroCtaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
      }, '-=0.35')
      .to(heroImageRef.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, '-=1.0')

      // Hero image parallax on scroll
      gsap.to(heroImageRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Subtle floating animation for hero image
      gsap.to(heroImageRef.current, {
        y: '+=15',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      })

      // Section reveal animations via ScrollTrigger
      const sections = document.querySelectorAll('section[id]')
      sections.forEach(section => {
        if (section.id !== 'reviews') {
          gsap.fromTo(section, {
            opacity: 0,
            y: 50,
          }, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none none',
            },
          })
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* HERO */}
      <div className="hero-section relative bg-cover bg-center" style={{ backgroundImage: "url('/hero-landscape.png')" }} ref={heroRef}>
        {/* Dark Premium Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-violet-950/85 to-black/50 z-0 pointer-events-none" />

        <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 w-full relative z-10">
          <div className="hero-content">
            <div ref={heroBadgeRef} style={{ opacity: 0 }}>
              <span className="hero-badge mb-6 bg-white/10 text-white border-white/20">
                <span className="hero-badge-dot bg-white"></span>
                Premium Web Development Agency
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8 text-white">
              <span className="hero-line"><span className="hero-line-inner" ref={heroLine1Ref} style={{ transform: 'translateY(100%)', opacity: 0 }}>We build stunning</span></span>
              <span className="hero-line"><span className="hero-line-inner" ref={heroLine2Ref} style={{ transform: 'translateY(100%)', opacity: 0 }}>websites <span style={{ color: '#a78bfa' }}>your way.</span></span></span>
            </h1>

            <p ref={heroDescRef} className="text-lg sm:text-xl max-w-xl font-normal leading-relaxed tracking-tight mb-12 text-zinc-300" style={{ opacity: 0 }}>From custom design architectures to tailored high-performing web apps, we build responsive, lightning-fast digital platforms designed to drive revenue, capture leads, and enhance your digital authority across Kenya and beyond.</p>

            <div ref={heroCtaRef} className="flex flex-col sm:flex-row items-start gap-4" style={{ opacity: 0 }}>
              <a href="/#questionnaire" className="w-full sm:w-auto text-white font-bold text-sm px-8 py-4 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center space-x-2 shadow-lg" style={{ background: 'rgb(var(--accent-rgb))', boxShadow: '0 8px 32px var(--glow)' }}>
                <span>Start Your Project</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
              <a href="https://wa.me/254758335592?text=Hi%20Cyzora%20Tech,%20I'd%20like%20to%20discuss%20a%20website%20project." target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto font-bold text-sm px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 hover:border-white/40 text-white" style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" style={{ color: 'var(--whatsapp)' }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.12 1.01 11.49 1.01c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.452 3.39 1.31 4.877L1.87 20.43l4.777-1.276z"/></svg>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* LOCAL KENYAN MARKET INTEGRATIONS */}
      <section id="integrations" className="max-w-6xl mx-auto px-6 py-24">
        <FadeUp>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--accent-rgb))' }}>Local Market Integrations</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--textLight)' }}>Built for Kenyan &amp; East African brands</h2>
            <p className="text-sm mt-3" style={{ color: 'var(--textGray)' }}>We integrate the payment and communication tools your customers already use every day.</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Automated M-Pesa Payments', sub: 'C2B · Lipa Na M-Pesa · STK Push', desc: 'Accept automated payments directly on your e-commerce or booking site. We integrate M-Pesa APIs, Safaricom\'s C2B and STK Push, plus major Kenyan bank channels — so your customers can pay the way they trust.', tags: ['M-Pesa API', 'STK Push', 'Bank Integration'], icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> },
            { title: 'SMS Notification Systems', sub: 'Africa\'s Talking · Twilio · Automated Alerts', desc: 'Keep your customers informed with automated SMS alerts for order confirmations, booking reminders, dispatch updates, and payment receipts. We integrate Africa\'s Talking API for reliable, low-cost SMS delivery across the continent.', tags: ['SMS Alerts', 'Africa\'s Talking', 'Auto Notifications'], icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="rounded-2xl p-8 transition-all hover:scale-[1.02] duration-300" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-brand-accent-faint" style={{ color: 'rgb(var(--accent-rgb))' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--textLight)' }}>{item.title}</h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'rgb(var(--accent-rgb))' }}>{item.sub}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--textGray)' }}>{item.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((t, j) => (
                    <span key={j} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-brand-accent-faint" style={{ color: 'rgb(var(--accent-rgb))' }}>{t}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* SERVICES - Crisp White */}
      <section id="services" className="py-24 bg-white dark:bg-zinc-950" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--accent-rgb))' }}>Our Core Capabilities</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--textLight)' }}>Engineered for speed, built for results.</h2>
              <p className="text-sm mt-3" style={{ color: 'var(--textGray)' }}>We focus on cutting-edge design, rock-solid security, and optimized lead-capture systems to help your business outpace your competitors.</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="rounded-3xl p-8 transition-all hover:scale-[1.03] duration-300 bg-zinc-50 dark:bg-zinc-900" style={{ border: '1px solid var(--border)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-brand-accent-faint" style={{ color: 'rgb(var(--accent-rgb))' }}>{s.icon}</div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--textLight)' }}>{s.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--textGray)' }}>{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* WEB SPEED SHOWDOWN - Deep Purple Section */}
      <section id="showdown" className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-5xl mx-auto bg-violet-950 text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-violet-800/40 p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-violet-300">Performance Showdown</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">See the Cyzora difference</h2>
                <p className="text-sm mt-3 text-violet-200/80">Toggle between a standard page template and a Cyzora bespoke build. Every millisecond matters for your search rankings and conversion rates.</p>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="rounded-3xl p-8 sm:p-10 bg-white/5 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-center gap-4 mb-10">
                  <span className="text-sm font-bold transition-opacity text-violet-200/60" style={{ opacity: isSpeedCyzora ? 0.4 : 1 }}>Standard Template Site</span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={isSpeedCyzora} onChange={() => setIsSpeedCyzora(!isSpeedCyzora)} />
                    <span className="toggle-slider" style={{ background: 'rgba(255,255,255,0.2)' }}></span>
                  </label>
                  <span className="text-sm font-bold text-violet-400" style={{ opacity: isSpeedCyzora ? 1 : 0.6 }}>Cyzora Bespoke App</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-2xl p-6 text-center bg-white/5 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 text-violet-200/60">Load Time</p>
                    <p className="text-4xl sm:text-5xl font-black transition-all duration-500 text-white">
                      {isSpeedCyzora ? '0.4' : '4.5'}<span className="text-lg font-medium text-violet-300">s</span>
                    </p>
                  </div>
                  <div className="rounded-2xl p-6 text-center bg-white/5 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 text-violet-200/60">Performance Score</p>
                    <p className="text-4xl sm:text-5xl font-black transition-all duration-500 text-violet-400">
                      {isSpeedCyzora ? '100' : '45'}<span className="text-lg font-medium text-violet-300">%</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'First Contentful Paint', std: '2.8s', cyz: '0.2s', stdW: 62, cyzW: 99 },
                    { label: 'Time to Interactive', std: '3.8s', cyz: '0.3s', stdW: 32, cyzW: 98 },
                    { label: 'Cumulative Layout Shift', std: '0.35', cyz: '0.00', stdW: 45, cyzW: 100 },
                  ].map((bar, i) => {
                    const w = isSpeedCyzora ? bar.cyzW : bar.stdW
                    const label = isSpeedCyzora ? bar.cyz : bar.std
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-semibold mb-1.5 text-violet-200/80">
                          <span>{bar.label}</span>
                          <span>{label}</span>
                        </div>
                        <div className="speed-bar-track" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="speed-bar-fill" style={{ width: w + '%', background: isSpeedCyzora ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xs leading-relaxed text-violet-200/60">
                    <span id="showdownStatus">{isSpeedCyzora ? 'Cyzora-engineered app: highly optimized serverless rendering, modern bundling, asset optimizations, and advanced global routing.' : 'Standard template builds suffer from bloated scripts and unoptimized structure.'}</span><br />
                    <span className="font-bold text-violet-300">Every Cyzora custom application scores 95+ on Lighthouse, guaranteed.</span>
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* PORTFOLIO - Crisp White */}
      <section id="portfolio" className="py-24 bg-white dark:bg-zinc-950" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--accent-rgb))' }}>Our Work</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--textLight)' }}>Projects we're proud of</h2>
              <p className="text-sm mt-3" style={{ color: 'var(--textGray)' }}>Every site we ship is built for speed, scalability, and a world-class user experience.</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((p, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <div className="portfolio-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="aspect-[4/3] flex items-center justify-center" style={{ background: p.gradient }}>
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'rgb(var(--accent-rgb))', opacity: 0.4 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="portfolio-overlay">
                    <h4 className="text-white text-lg font-bold">{p.name}</h4>
                    <p className="text-white/80 text-xs mb-2">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t, j) => (
                        <span key={j} className="text-[10px] font-bold text-white px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.15)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-24 bg-white dark:bg-zinc-950" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-2 text-orange-500">Wall of Reviews</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: 'var(--textLight)' }}>Kenya's most trusted development team</h2>
              <p className="text-base mt-3" style={{ color: 'var(--textGray)' }}>Don't take our word for it. Here is how we've helped 20+ brands bring their brand, voice, and platforms to life.</p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Abdi Mohamed', company: 'Trivo Kenya', comment: 'Cyzora built our e-commerce platform exactly our way. The custom checkout and M-Pesa flows are flawless!' },
              { name: 'Dennis Kiprotich', company: 'PrimeCart Logistics', comment: 'Our delivery tracking page is incredibly fast and our conversion rates went up by 40% after launching.' },
              { name: 'Sarah Leshan', company: 'Belloria Beauty', comment: 'The custom beauty portal works perfectly. The design captures our premium brand identity beautifully.' },
              { name: 'Joseph Njoroge', company: 'Munchify', comment: 'Highly professional engineering. The fast loading times of our platform are a game-changer for our customers.' },
              { name: 'Emily Kemboi', company: 'Edyfra Learning', comment: 'The dynamic layout and clean structure make managing our courses simple and automated.' },
              { name: 'Peter Mwangi', company: 'Prime Realtors', comment: 'Bespoke custom app that handles our property catalogs seamlessly. Spacing and layouts are top notch.' },
              { name: 'Grace Wambui', company: 'Shamba Links', comment: 'No templates, they coded the platform exactly to our specifications. Highly recommend Cyzora.' },
              { name: 'David Onyango', company: 'Lake Logistics', comment: 'Breathtaking animations and smooth scroll effects. Excellent support team.' },
              { name: 'Fiona Muthoni', company: 'Zuri Designs', comment: 'Great communication during project delivery. Clean, premium look.' },
              { name: 'Brian Koech', company: 'Rift Safaris', comment: 'Fast responsive designs that have brought in massive leads.' },
              { name: 'Ivy Wanjiku', company: 'Nyama Bite', comment: 'Outstanding app development with automated checkout systems.' },
              { name: 'Kelvin Odhiambo', company: 'K-Tech Solutions', comment: 'Our custom software platform runs seamlessly. Truly Kenya\'s best developers.' },
              { name: 'Mercy Achieng', company: 'Care Health', comment: 'Beautiful pixel-perfect layouts. Easy for our admin team to use.' },
              { name: 'Steve Muriithi', company: 'Nairobi Cafe', comment: 'Top-notch developers who bring layouts to life.' },
              { name: 'Ruth Akinyi', company: 'Soko Market', comment: 'Professional delivery on all custom requirements.' },
              { name: 'Hassan Aden', company: 'Somali Express', comment: 'Brilliant speed scores. Exceeded our expectations.' },
              { name: 'Cynthia Ndwiga', company: 'Apex Consulting', comment: 'Fast responsive design that aligns perfectly with our brand.' },
              { name: 'Martin Ndungu', company: 'Alpha Academy', comment: 'Automated notification modules work flawlessly.' },
              { name: 'Patricia Ndolo', company: 'Diani Getaways', comment: 'Stunning visual layout that our global clients love.' },
              { name: 'Victor Obiero', company: 'Pioneer Gyms', comment: 'Clean coding standards and detailed performance checks.' }
            ].map((rev, idx) => (
              <FadeUp key={idx} delay={(idx % 3) * 0.05}>
                <div 
                  className="p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between h-full bg-stone-50/50 dark:bg-zinc-900/50" 
                  style={{ 
                    borderColor: 'var(--border)', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    {/* Stars rating in orange */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-orange-500 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {/* Quote text: larger fonts and premium feeling */}
                    <p className="text-base sm:text-lg font-medium tracking-tight mb-6 leading-relaxed italic text-zinc-800 dark:text-zinc-200 font-sans">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
                      {rev.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-zinc-950 dark:text-white">{rev.name}</h4>
                      <p className="text-xs font-bold text-orange-500">{rev.company}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS - Deep Purple Section */}
      <section id="process" className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-6xl mx-auto bg-violet-950 text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-violet-800/40 p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.12),transparent_50%)] pointer-events-none" />
          <div className="relative z-10">
            <FadeUp>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-violet-300">Our Blueprint</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">How We Launch Your Website</h2>
                <p className="text-sm mt-3 text-violet-200/80">We have optimized our delivery pipeline to be highly efficient, collaborative, and entirely transparent.</p>
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: '01', title: '1. Strategy & Discovery', desc: 'We begin with a thorough Zoom or traditional phone call to map out your core feature set, design guidelines, reference sites, and target audience needs.' },
                { num: '02', title: '2. Engineering & Design', desc: 'Our team codes responsive custom components and integrates blazing-fast databases, working closely within your chosen tier parameters for a pixel-perfect layout.' },
                { num: '03', title: '3. QA, Optimize & Launch', desc: 'We perform complete cross-device testing, configure comprehensive SEO patterns, run detailed page-speed diagnostics, and hand over your active login credentials.' },
              ].map((step, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="rounded-3xl p-8 relative overflow-hidden transition-all hover:scale-[1.03] duration-300 bg-white/5 border border-white/10">
                    <div className="absolute top-4 right-6 text-6xl font-extrabold text-violet-400/10">{step.num}</div>
                    <h4 className="text-lg font-bold mb-3 text-white">{step.title}</h4>
                    <p className="text-xs leading-relaxed text-violet-200/70">{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - Crisp White */}
      <section id="pricing" className="py-24 bg-white dark:bg-zinc-950" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--accent-rgb))' }}>Flexible Packages</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--textLight)' }}>Transparent pricing structures</h2>
              <p className="text-sm mt-3" style={{ color: 'var(--textGray)' }}>Choose the perfect package to launch or scale your brand's digital presence.</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all`} style={{
                  background: 'var(--card)',
                  border: plan.popular ? '2px solid var(--gold)' : '1px solid var(--border)',
                  boxShadow: plan.popular ? '0 20px 60px color-mix(in srgb, var(--gold) 8%, transparent)' : 'none'
                }}>
                  {plan.popular && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 text-black text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full" style={{ background: 'var(--gold)' }}>Most Popular</div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: 'var(--textLight)' }}>{plan.name}</h3>
                      <p className="text-xs mt-1" style={{ color: plan.popular ? 'var(--gold)' : 'var(--textGray)' }}>{plan.tagline}</p>
                    </div>
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--textGray)' }}>KES</span>
                        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: plan.popular ? 'var(--gold)' : 'var(--textLight)' }}>{plan.price}</span>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--textGray)' }}>one-time project fee</p>
                    </div>
                    <ul className="space-y-4 text-xs" style={{ color: 'var(--textLight)' }}>
                      {plan.features.map((feat, j) => (
                        <li key={j} className="flex items-start space-x-3">
                          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: 'var(--gold)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-8">
                    <a href="/#questionnaire" onClick={() => { setSelectedPlan(plan.name); setQPlan(plan.name) }}
                      className={`block w-full text-center font-semibold text-sm py-3.5 px-4 rounded-xl transition-all`}
                      style={plan.popular ? { background: 'var(--gold)', color: '#000', boxShadow: '0 8px 24px color-mix(in srgb, var(--gold) 20%, transparent)' } : { background: 'var(--grayDark)', color: 'var(--textLight)', border: '1px solid var(--border)' }}>
                      Choose {plan.name}
                    </a>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* QUESTIONNAIRE - Deep Purple Section */}
      <section id="questionnaire" className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-4xl mx-auto bg-violet-950 text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-violet-800/40 p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center max-w-xl mx-auto mb-12">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-violet-300">Project Scope Questionnaire</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Tell us about your project</h2>
                <p className="text-sm mt-3 text-violet-200/80">Answer 4 quick questions and we'll prepare a tailored proposal before our call.</p>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="rounded-3xl p-6 sm:p-10 relative shadow-2xl overflow-hidden bg-white/5 border border-white/10">
              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex items-center">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s <= qStep && qStep < 5 ? '#a78bfa' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}></div>
                    {s < 4 && <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginLeft: 8 }}></div>}
                  </div>
                ))}
              </div>

              {/* Step 1 */}
              {qStep === 1 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-violet-300">Step 1 of 4</p>
                  <h3 className="text-xl font-bold mb-6 text-white">What kind of site do you need?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['E-commerce Store', 'Portfolio / Showcase', 'Corporate Portal', 'Custom Blog / Portal'].map(opt => (
                      <button key={opt} onClick={() => handleQSelect('siteType', opt)}
                        className="text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: qData.siteType === opt ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.05)', color: '#ffffff', border: qData.siteType === opt ? '2px solid #a78bfa' : '2px solid transparent' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 text-right">
                    <button onClick={() => nextQStep(2)} className="text-black font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition-all bg-white" style={{ opacity: qData.siteType ? 1 : 0.4 }} disabled={!qData.siteType}>Next Step</button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {qStep === 2 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-violet-300">Step 2 of 4</p>
                  <h3 className="text-xl font-bold mb-6 text-white">Do you need custom payment gateways?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['M-Pesa & Card', 'Just Card', 'None'].map(opt => (
                      <button key={opt} onClick={() => handleQSelect('payment', opt)}
                        className="text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: qData.payment === opt ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.05)', color: '#ffffff', border: qData.payment === opt ? '2px solid #a78bfa' : '2px solid transparent' }}>
                        {opt === 'M-Pesa & Card' ? 'Yes, M-Pesa & Card' : opt === 'Just Card' ? 'Just Card Payments' : 'No Payment Gateways'}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => prevQStep(1)} className="text-sm font-semibold px-6 py-3 rounded-xl transition-all text-violet-200 bg-white/10">Back</button>
                    <button onClick={() => nextQStep(3)} className="text-black font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition-all bg-white" style={{ opacity: qData.payment ? 1 : 0.4 }} disabled={!qData.payment}>Next Step</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {qStep === 3 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-violet-300">Step 3 of 4</p>
                  <h3 className="text-xl font-bold mb-6 text-white">Do you have your content and logos ready?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Ready', 'Need Copywriting'].map(opt => (
                      <button key={opt} onClick={() => handleQSelect('content', opt)}
                        className="text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: qData.content === opt ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.05)', color: '#ffffff', border: qData.content === opt ? '2px solid #a78bfa' : '2px solid transparent' }}>
                        {opt === 'Ready' ? 'Yes, all ready to go' : 'Need copywriting help'}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => prevQStep(2)} className="text-sm font-semibold px-6 py-3 rounded-xl transition-all text-violet-200 bg-white/10">Back</button>
                    <button onClick={() => nextQStep(4)} className="text-black font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition-all bg-white" style={{ opacity: qData.content ? 1 : 0.4 }} disabled={!qData.content}>Next Step</button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {qStep === 4 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-violet-300">Step 4 of 4</p>
                  <h3 className="text-xl font-bold mb-6 text-white">What is your desired launch timeline?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Within 2 weeks', '1 month', 'Flexible'].map(opt => (
                      <button key={opt} onClick={() => handleQSelect('timeline', opt)}
                        className="text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: qData.timeline === opt ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.05)', color: '#ffffff', border: qData.timeline === opt ? '2px solid #a78bfa' : '2px solid transparent' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => prevQStep(3)} className="text-sm font-semibold px-6 py-3 rounded-xl transition-all text-violet-200 bg-white/10">Back</button>
                    <button onClick={() => nextQStep(5)} className="text-black font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition-all bg-white" style={{ opacity: qData.timeline ? 1 : 0.4 }} disabled={!qData.timeline}>Get My Proposal</button>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {qStep === 5 && (
                <div className="py-8 text-center flex flex-col items-center space-y-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10">
                    <svg className="w-8 h-8 text-violet-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-white">Your proposal is being prepared!</h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed text-violet-200/80">
                    Great choices! You want a <strong className="text-white">{qData.siteType}</strong>
                    {qData.payment === 'M-Pesa & Card' ? ' with M-Pesa & Card' : qData.payment === 'Just Card' ? ' with card payments' : ''} for the <strong className="text-violet-300">{qPlan}</strong> package (KES {qPlan === 'Bronze' ? '20,000' : qPlan === 'Silver' ? '55,000' : '99,000'}). Timeline: <strong className="text-white">{qData.timeline}</strong>. {qData.content === 'Ready' ? 'You have content ready.' : 'You need copywriting help.'} We\'ll be in touch within 24 hours!
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <a href="https://wa.me/254758335592?text=Hi%20Cyzora,%20I%20just%20submitted%20my%20project%20scope." target="_blank" rel="noopener noreferrer" className="text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all bg-emerald-500 hover:brightness-110">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.12 1.01 11.49 1.01c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.452 3.39 1.31 4.877L1.87 20.43l4.777-1.276z"/></svg>
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button onClick={() => { setQStep(1); setQData({ siteType: '', payment: '', content: '', timeline: '' }) }} className="text-sm font-semibold px-5 py-3 rounded-xl transition-all text-violet-200 bg-white/10 hover:bg-white/20">Start Over</button>
                  </div>
                </div>
              )}
            </div>
          </FadeUp>
          </div>
        </div>
      </section>

      {/* FAQ - Crisp White */}
      <section id="faq" className="py-24 bg-white dark:bg-zinc-950" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--accent-rgb))' }}>Frequently Asked Questions</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--textLight)' }}>Got questions? We've got answers.</h2>
            </div>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.04}>
                <div className="rounded-2xl overflow-hidden transition-all" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between px-5 py-5 cursor-pointer select-none" onClick={() => toggleFaq(i)}>
                    <span className="text-sm font-bold pr-4" style={{ color: 'var(--textLight)' }}>{faq.q}</span>
                    <svg className="w-4 h-4 shrink-0 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: 'var(--textGray)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                  <div className="q-answer text-sm leading-relaxed" style={{ color: 'var(--textGray)', padding: openFaq === i ? '0 1.5rem 1.25rem' : '0 1.5rem' }}>
                    <div className={openFaq === i ? '' : 'hidden'}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / FOUNDERS - Deep Purple */}
      <section id="why-cyzora" className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="max-w-5xl mx-auto bg-violet-950 text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-violet-800/40 p-8 sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-300">Behind the Code</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Our Core Philosophy</h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed text-violet-200/80">
              Cyzora was founded and crafted by <strong className="text-white">Marsley Mash</strong> and <strong className="text-white">Emmanuel Charles</strong>. With years of experience pushing the boundaries of custom application performance, responsive layouts, and automated systems, we build premium digital frameworks designed to grow alongside your brand.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs font-medium">
              <span className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-violet-200">Marsley Mash — Lead Architect</span>
              <span className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-violet-200">Emmanuel Charles — Core Engineer</span>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING SCHEDULER */}
      <section id="booking" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-24 relative">
          <div style={{ position: 'absolute', top: '50%', left: 0, width: 300, height: 300, borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none', background: 'var(--glow)' }}></div>

          <FadeUp>
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--accent-rgb))' }}>Schedule A Strategy Consultation</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--textLight)' }}>Let's finalize your project</h2>
              <p className="text-sm mt-3" style={{ color: 'var(--textGray)' }}>Book a 15-minute Zoom call or traditional phone call to confirm your scope and timeline.</p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="rounded-3xl p-6 sm:p-10 relative shadow-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px var(--glow)' }}>
              {!confirmed ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--textGray)' }}>1. Select Call Format</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setCallType('zoom')}
                          className="py-4 px-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
                          style={callType === 'zoom' ? { border: '2px solid rgb(var(--accent-rgb))', background: 'color-mix(in srgb, rgb(var(--accent-rgb)) 12%, transparent)', color: 'var(--textLight)' } : { border: '1px solid var(--border)', background: 'transparent', color: 'var(--textGray)' }}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'rgb(var(--accent-rgb))' }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          <span className="text-xs font-bold">Zoom Meeting</span>
                        </button>
                        <button onClick={() => setCallType('phone')}
                          className="py-4 px-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all"
                          style={callType === 'phone' ? { border: '2px solid rgb(var(--accent-rgb))', background: 'color-mix(in srgb, rgb(var(--accent-rgb)) 12%, transparent)', color: 'var(--textLight)' } : { border: '1px solid var(--border)', background: 'transparent', color: 'var(--textGray)' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="text-xs font-bold">Direct Phone Call</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--textGray)' }}>2. Desired Package</label>
                      <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ background: 'var(--grayDark)', color: 'var(--textLight)', border: '1px solid var(--border)' }}>
                        <option value="Bronze">Bronze Package (KES 20,000)</option>
                        <option value="Silver">Silver Package (KES 55,000)</option>
                        <option value="Gold">Gold Package (KES 99,000)</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--textGray)' }}>3. Your Information</label>
                      <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Full name"
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ background: 'var(--grayDark)', color: 'var(--textLight)', border: '1px solid var(--border)' }} />
                      <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Email address"
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ background: 'var(--grayDark)', color: 'var(--textLight)', border: '1px solid var(--border)' }} />
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--textGray)' }}>4. Choose Date</label>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {dates.map((d, i) => (
                          <button key={i} onClick={() => setSelectedDate(i)}
                            className="py-3.5 rounded-xl text-xs transition-all"
                            style={selectedDate === i ? { border: '2px solid rgb(var(--accent-rgb))', background: 'color-mix(in srgb, rgb(var(--accent-rgb)) 12%, transparent)', color: 'var(--textLight)' } : { border: '1px solid var(--border)', background: 'transparent', color: 'var(--textGray)' }}>
                            <span className="block text-[9px] uppercase font-black" style={{ color: selectedDate === i ? 'rgb(var(--accent-rgb))' : '' }}>{d.day}</span>
                            <span className="font-extrabold text-sm">{d.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--textGray)' }}>5. Select Available Time</label>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        {times.map((t, i) => (
                          <button key={i} onClick={() => setSelectedTime(i)}
                            className="py-3 rounded-xl text-xs font-semibold transition-all"
                            style={selectedTime === i ? { border: '2px solid rgb(var(--accent-rgb))', background: 'color-mix(in srgb, rgb(var(--accent-rgb)) 12%, transparent)', color: 'var(--textLight)' } : { border: '1px solid var(--border)', background: 'transparent', color: 'var(--textGray)' }}>
                            {t} EAT
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={submitBooking}
                      disabled={bookingSending || !clientName || !clientEmail}
                      className="w-full text-white font-extrabold text-sm py-4 rounded-xl transition-all hover:brightness-110 disabled:opacity-50"
                      style={{ background: 'rgb(var(--accent-rgb))', boxShadow: '0 8px 24px var(--glow)' }}>
                      {bookingSending ? 'Submitting...' : 'Confirm Consultation Call'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-brand-accent-faint flex items-center justify-center" style={{ color: 'rgb(var(--accent-rgb))' }}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black" style={{ color: 'var(--textLight)' }}>Call Confirmed!</h3>
                  <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--textGray)' }}>
                    Awesome, <strong style={{ color: 'var(--textLight)' }}>{clientName || 'there'}</strong>! Your 15-minute <strong style={{ color: 'rgb(var(--accent-rgb))' }}>{callType === 'zoom' ? 'Zoom Meeting' : 'Phone Call'}</strong> has been booked for <strong style={{ color: 'var(--textLight)' }}>{dates[selectedDate].day}, {dates[selectedDate].date}</strong> at <strong style={{ color: 'var(--textLight)' }}>{times[selectedTime]} EAT</strong> regarding the <strong style={{ color: 'var(--gold)' }}>{selectedPlan}</strong> Package.
                  </p>
                  <p className="text-xs" style={{ color: 'var(--textGray)' }}>We've dispatched an invite to your inbox with instructions.</p>
                  <div className="pt-2">
                    <button onClick={() => { setConfirmed(false); setClientName(''); setClientEmail(''); setSelectedPlan('Silver'); setCallType('zoom'); setSelectedDate(0); setSelectedTime(0); }}
                      className="text-sm font-semibold px-6 py-2.5 rounded-xl transition-all" style={{ color: 'var(--textGray)', background: 'var(--grayDark)' }}>
                      Schedule Another Call
                    </button>
                  </div>
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
