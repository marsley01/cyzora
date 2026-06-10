import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are the CyzoraTech support assistant. You work for a Nairobi-based web design and development agency.

Services: Bespoke Custom Web Design, Premium Custom Applications, SEO & Conversion Optimization.
Pricing: Bronze (KES 20,000 - 5 pages), Silver (KES 55,000 - 10 pages, most popular), Gold (KES 99,000 - 20 pages).
Integrations: M-Pesa C2B, Lipa Na M-Pesa, STK Push, Africa's Talking SMS.
Portfolio: Trivo Kenya, PrimeCart Logistics, Belloria Beauty, Munchify, Edyfra Learning, Client Portal.

Be concise, friendly, and helpful. Keep responses under 3 sentences. If asked something you don't know, suggest they email hi@cyzorastudio.com or call 0758 335 592.`

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
]

async function callGemini(model, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
