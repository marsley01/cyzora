const store = new Map()

export function rateLimit({ interval = 60000, max = 10 } = {}) {
  return function (request) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'anonymous'

    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now - entry.start > interval) {
      store.set(ip, { start: now, count: 1 })
      return { allowed: true }
    }

    entry.count++
    if (entry.count > max) {
      return { allowed: false, retryAfter: Math.ceil((entry.start + interval - now) / 1000) }
    }

    return { allowed: true }
  }
}
