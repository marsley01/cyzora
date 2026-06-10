export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: 'https://cyzora.vercel.app/sitemap.xml',
  }
}
