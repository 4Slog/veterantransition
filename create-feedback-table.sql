-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wdeapqigbawupclbbbdj/sql

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text,
  message text NOT NULL,
  rating smallint CHECK (rating BETWEEN 1 AND 5),
  resume_type text,
  page_url text,
  user_id uuid
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow the API (service role) to insert — no user login required
CREATE POLICY "service_insert" ON feedback
  FOR INSERT WITH CHECK (true);

-- Block all direct reads (view data in Supabase dashboard only)
CREATE POLICY "no_public_select" ON feedback
  FOR SELECT USING (false);
