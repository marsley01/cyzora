# Cyzora Tech

**Premium Web Design & Development Agency — Nairobi, Kenya**

Cyzora is the marketing website and digital storefront for a Nairobi-based web development agency. It was built to showcase the agency's work, communicate its value proposition, and convert visitors into leads — all with a polished, interactive experience that demonstrates the agency's own capabilities.

## What It Does

- **Markets three service tiers** (Bronze, Silver, Gold) with transparent KES pricing
- **Showcases a portfolio** of six real client projects with hover-reveal overlays
- **Provides a project scope questionnaire** — a 4-step wizard that helps visitors scope their website needs (site type, payment integrations, content readiness, timeline)
- **Offers a consultation booking scheduler** — date/time picker with Zoom or phone call options
- **Includes a Web Speed Showdown** — an interactive comparison widget showing performance metrics (load time, FCP, TTI, CLS) between standard templates and Cyzora's bespoke builds
- **Hosts a live chatbot** — a frontend-based rule-driven assistant accessible via a floating button
- **Displays a "Talk to Us" modal** with email, phone, WhatsApp, and a quick message form
- **Presents 20 client testimonials** in a masonry grid
- **Supports dark/light mode** with system-preference-aware persistence

## Why We Built It

We needed a website that did more than just describe what we do — it had to **prove it**. Every interaction on the site is a demonstration of the quality, performance, and attention to detail we bring to client projects.

Key motivations:

- **Show, don't tell** — The site itself is our best portfolio piece. From GSAP-powered animations to a custom cursor and liquid-glass navbar, it showcases the craftsmanship we deliver.
- **Local-first positioning** — We integrated M-Pesa references, Africa's Talking SMS, and KES pricing to speak directly to the Kenyan market.
- **Lead generation through interaction** — Instead of a static contact form, visitors can scope their project, book a consultation, or chat with the bot — multiple low-friction paths to connect.
- **Performance transparency** — The Web Speed Showdown widget makes our performance obsession tangible. Visitors can see exact metrics comparing template sites vs. custom builds.
- **Frontend-only prototype** — The simulated chatbot, booking scheduler, and admin dashboard (SupportDashboard) are intentionally client-side to demonstrate concepts without building a full backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS 3 + Custom CSS |
| Animations | GSAP 3 + Framer Motion |
| Icons | Lucide React |
| Font | Inter (next/font) |
| Deployment | Vercel (auto-deploys from `master`) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/          — Next.js app directory (layout, pages, global styles)
components/   — Reusable UI components (Navbar, Footer, ChatBot, FadeUp, SupportDashboard)
public/       — Static assets (images, video, backgrounds)
```

## Deployment

Auto-deployed to Vercel on every push to `master`.

---

Built by **Marsley Mash** (Lead Architect) and **Emmanuel Charles** (Core Engineer).
