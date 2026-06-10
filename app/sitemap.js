export default function sitemap() {
  const base = 'https://cyzora.vercel.app'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/admin/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
  ]
}
