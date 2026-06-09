import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-violet-950 text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Brand & Phone numbers */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" style={{ color: '#c084fc', stroke: 'currentColor' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-lg font-extrabold tracking-tight text-white">cyzora<span style={{ color: '#c084fc' }}>.</span></span>
            </Link>
            <p className="text-xs max-w-sm leading-relaxed text-violet-200/80">
              Kenya's premium website and application development agency. We design and build custom web experiences tailored specifically to scale your business.
            </p>
            <div className="space-y-2.5 pt-2 text-xs text-violet-200/70">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-violet-400" />
                <a href="tel:0758335592" className="hover:text-white transition-colors">0758 335 592 (Admin)</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-violet-400" />
                <a href="tel:0749610772" className="hover:text-white transition-colors">0749 610 772 (Sales)</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-violet-400" />
                <a href="mailto:hi@cyzorastudio.com" className="hover:text-white transition-colors">hi@cyzorastudio.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-violet-400" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Solutions</h5>
            <div className="flex flex-col space-y-2.5 text-xs text-violet-200/80">
              <a href="/#services" className="hover:underline transition-all hover:text-white text-violet-200" style={{ textDecorationColor: '#c084fc' }}>Our Services</a>
              <a href="/#portfolio" className="hover:underline transition-all hover:text-white text-violet-200" style={{ textDecorationColor: '#c084fc' }}>Recent Projects</a>
              <a href="/#reviews" className="hover:underline transition-all hover:text-white text-violet-200" style={{ textDecorationColor: '#c084fc' }}>Customer Reviews</a>
              <a href="/#pricing" className="hover:underline transition-all hover:text-white text-violet-200" style={{ textDecorationColor: '#c084fc' }}>Tiered Packages</a>
            </div>
          </div>

          {/* Slogan details */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Our Philosophy</h5>
            <p className="text-xs leading-relaxed text-violet-200/80">
              Your brand, your voice, your website. We don't believe in generic templates. We build your online presence exactly your way, engineered from the ground up for maximum visual appeal and fast performance.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] mt-8 text-violet-300/60">
          <div>
            <p>&copy; {new Date().getFullYear()} Cyzora Tech. Premium custom digital solutions. All rights reserved.</p>
            <p className="mt-1">Founded by Marsley Mash &amp; Emmanuel Charles</p>
          </div>
          <div className="flex space-x-6 mt-4 sm:mt-0 text-violet-300/70">
            <a href="#" className="hover:underline transition-all hover:text-white" style={{ textDecorationColor: '#c084fc' }}>Privacy Policy</a>
            <a href="#" className="hover:underline transition-all hover:text-white" style={{ textDecorationColor: '#c084fc' }}>Terms &amp; Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
