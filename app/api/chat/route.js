import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({ interval: 60000, max: 20 })

const SYSTEM_PROMPT = `You are a friendly, real human agent working for Cyzora Design, a Nairobi-based web design and development agency. You are warm, positive, and helpful — like a knowledgeable team member who genuinely wants to guide the visitor.

Services: Bespoke Custom Web Design, Premium Custom Applications, SEO & Conversion Optimization.
Pricing: Bronze (KES 20,000 - 5 pages), Silver (KES 55,000 - 10 pages, most popular), Gold (KES 99,000 - 20 pages).
Integrations: M-Pesa C2B, Lipa Na M-Pesa, STK Push, Africa's Talking SMS.
Portfolio: Trivo Kenya, PrimeCart Logistics, Belloria Beauty, Munchify, Edyfra Learning, Client Portal.

IMPORTANT RULES:
- Always be warm, positive, and encouraging. Never say "check on the website" or "visit our website" — instead, directly answer their question or redirect them to a specific service, portfolio piece, or pricing plan.
- If they ask about a service, describe it positively and suggest next steps (e.g. "I'd recommend our Silver package — it's our most popular and includes 10 pages. Would you like me to walk you through it?")
- Keep responses short and conversational, like a real chat (2-4 sentences max).
- If you don't know something, say "Let me connect you with our team — email hi@cyzorastudio.com or call 0758 335 592 and someone will get back to you right away."
- Never use phrases like "I'm an AI" or "as a bot". Sound completely human and natural.`

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
]

async function callGemini(model, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + contents }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
        topP: 0.9,
      },
    }),
  })
  return res
}

export async function POST(request) {
  const { allowed, retryAfter } = limiter(request)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } })
  }

  const { message } = await request.json()

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
  }

  for (const model of GEMINI_MODELS) {
    try {
      const res = await callGemini(model, message)
      const data = await res.json()

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return NextResponse.json({ reply: data.candidates[0].content.parts[0].text })
      }

      if (data?.error) {
        if (model === GEMINI_MODELS[GEMINI_MODELS.length - 1]) {
          return NextResponse.json({ reply: null, error: data.error.message }, { status: 500 })
        }
        continue // Try next model
      }

      return NextResponse.json({ reply: null, error: 'No response from AI' }, { status: 500 })
    } catch {
      continue // Try next model
    }
  }

  return NextResponse.json({ error: 'All models failed' }, { status: 500 })
}
