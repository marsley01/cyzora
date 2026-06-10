-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/<your-project>/sql/new)

-- 1. Admins table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own record"
  ON admins FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can update own record"
  ON admins FOR UPDATE
  USING (auth.uid() = id);

-- 2. Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  call_type TEXT NOT NULL CHECK (call_type IN ('zoom', 'phone')),
  package_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all bookings"
  ON bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 3. Questionnaires
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  site_type TEXT NOT NULL,
  payment TEXT NOT NULL,
  content TEXT NOT NULL,
  timeline TEXT NOT NULL,
  package_name TEXT NOT NULL DEFAULT 'Silver',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert questionnaires"
  ON questionnaires FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all questionnaires"
  ON questionnaires FOR SELECT
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 4. Support Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert tickets"
  ON tickets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage tickets"
  ON tickets FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 5. Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ticket_id BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON ticket_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read messages"
  ON ticket_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 6. Messages (direct inquiries from "Talk to Us" modal)
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read messages"
  ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 7. Create initial admin function (call this after creating a user in Auth)
-- Run this separately after creating an admin user in Supabase Auth:
-- INSERT INTO admins (id, email, name)
-- VALUES ('<user-uuid-from-auth>', '<admin-email>', 'Mash');
