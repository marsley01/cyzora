import { Inter } from 'next/font/google'
import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Cyzora Design — Premium Web Design & Development Agency Nairobi',
  description: 'Nairobi-based web agency building custom websites, e-commerce stores, portals and platforms for Kenyan & East African brands. Bespoke development, M-Pesa integration, SEO.',
  keywords: 'web design Kenya, web development Nairobi, custom websites Kenya, M-Pesa integration, e-commerce Kenya, SEO Kenya, web agency Nairobi, React development Kenya, Next.js Kenya',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://cyzora.vercel.app',
    siteName: 'Cyzora Design',
    title: 'Cyzora Design — Premium Web Design & Development Agency Nairobi',
    description: 'Nairobi-based web agency building custom websites, stores, and platforms. Bespoke development with M-Pesa integration, SEO, and performance optimisation.',
    images: [{ url: 'https://cyzora.vercel.app/hero-image.png', width: 1200, height: 630, alt: 'Cyzora Design — Premium Web Design & Development' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyzora Design — Premium Web Design & Development',
    description: 'Nairobi-based web agency. Custom websites, e-commerce, portals. M-Pesa integration. React, Next.js, Tailwind CSS.',
    images: ['https://cyzora.vercel.app/hero-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cyzora.vercel.app' },
  other: {
    'geo.region': 'KE-110',
    'geo.placename': 'Nairobi',
    'og:locale:alternate': 'sw_KE',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} style={{ color: 'var(--textLight)', background: 'var(--bg)' }}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
