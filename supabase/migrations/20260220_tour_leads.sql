-- tour_leads: capture name and email from the tour welcome step (anonymous)
CREATE TABLE IF NOT EXISTS tour_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tour_leads_created_at
  ON tour_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tour_leads_email
  ON tour_leads (email);

ALTER TABLE tour_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated users (tour page visitors) can insert
CREATE POLICY tour_leads_insert_anon ON tour_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY tour_leads_insert_authenticated ON tour_leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can read (e.g. for admin export or CRM)
CREATE POLICY tour_leads_select_authenticated ON tour_leads
  FOR SELECT
  TO authenticated
  USING (true);
