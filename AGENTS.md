# Git Configuration
- user.name: Marsley Mash
- user.email: mashmarsley@gmail.com
- remote: https://github.com/marsley01/cyzora.git

# Vercel
- Team: mashs-projects-01ac6ca6
- Project: cyzora
- CLI user: mashmarsley-9658
- Auto-deploys from GitHub pushes to master

# Supabase Setup (for admin dashboard, bookings, questionnaires)
- Admin dashboard: https://cyzora.vercel.app/admin
- Login page: https://cyzora.vercel.app/admin/login

## Setup Steps
1. Create a Supabase project at https://supabase.com (free tier works)
2. Go to Project Settings > API and copy your URL and anon key
3. Set environment variables in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
4. Run the schema from `supabase/schema.sql` in Supabase SQL Editor
5. In Supabase Auth, enable email/password sign-up (disable public sign-up after creating your admin)
6. Create your admin account:
   - Sign up via `/api/auth/signup` with email + password
   - Or use Supabase Dashboard > Authentication > Users > Add User
   - Then run: `INSERT INTO admins (id, email, name) VALUES ('<user-uuid>', '<email>', 'Mash');`
7. Access the admin panel at `/admin` and log in

## Gmail / Email Notifications
- When someone books a call, an email is sent to the Gmail address configured in `GMAIL_EMAIL`
- To set up: https://myaccount.google.com/apppasswords (generate an app password)
- Add `GMAIL_EMAIL` and `GMAIL_APP_PASSWORD` as Vercel environment variables

## Chatbot
- Chat conversations are saved to Supabase and viewable in the admin dashboard under the "Chats" tab
- Each visitor gets a unique session ID stored in localStorage
- Conversations persist across page refreshes

## Vercel Cron Jobs (via vercel.json)
Auto-deployed on Vercel. Vercel sends `Authorization: Bearer <CRON_SECRET>`.
| Route | Schedule | Purpose |
|---|---|---|
| GET /api/cron/cleanup | Daily at midnight | Deletes chat/message data older than 90 days |
| GET /api/cron/tickets | Daily at 8am | Auto-closes stale tickets (no activity 7+ days) |
| GET /api/cron/summary | Mondays at 9am | Returns weekly booking/ticket/message counts |
| GET /api/cron/health | Every 5 minutes | Uptime check + Supabase connectivity test |
Set `CRON_SECRET` in Vercel env vars.

## Security
- **CSP** set via next.config.js (restricts scripts, styles, connections)
- **Rate limiting** on all public POST endpoints (in-memory, per IP)
- **Gemini API key** sent via `x-goog-api-key` header, not URL query param
- **HSTS**, **Permissions-Policy**, **X-Content-Type-Options**, **X-Frame-Options**, **Referrer-Policy** all configured

## API Routes
- POST /api/bookings — Create a booking (also sends email notification) [rate-limited: 5/min]
- GET /api/bookings — List all bookings (admin only via RLS)
- POST /api/questionnaire — Submit a project scope [rate-limited: 5/min]
- GET /api/questionnaire — List scopes (admin only)
- GET/POST /api/tickets — List/create support tickets [POST rate-limited: 10/min]
- PATCH /api/tickets/[id] — Update ticket status/priority
- GET/POST /api/tickets/[id]/messages — Ticket conversation [POST rate-limited: 10/min]
- GET/POST /api/messages — List/submit contact messages [POST rate-limited: 5/min]
- GET/POST /api/messages/chat — List/save chat conversations [rate-limited: 30 GET/min, 10 POST/min]
- POST /api/chat — Gemini AI chatbot reply [rate-limited: 20/min]
- GET /api/cron/* — Cron job endpoints (secured by CRON_SECRET)
