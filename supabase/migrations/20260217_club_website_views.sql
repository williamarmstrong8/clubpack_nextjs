-- club_website_views: track page views for club sites (for analytics dashboard)
CREATE TABLE IF NOT EXISTS club_website_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  path text
);

CREATE INDEX IF NOT EXISTS idx_club_website_views_club_viewed
  ON club_website_views (club_id, viewed_at DESC);

ALTER TABLE club_website_views ENABLE ROW LEVEL SECURITY;

-- No direct INSERT for anon; use record_club_page_view RPC instead (validates subdomain).

-- Admins can read views for their club only
CREATE POLICY club_website_views_select_admin ON club_website_views
  FOR SELECT
  TO authenticated
  USING (
    club_id IN (
      SELECT profiles.club_id FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.club_id IS NOT NULL
    )
  );

-- RPC: record a page view for a club by subdomain (validates before insert)
CREATE OR REPLACE FUNCTION record_club_page_view(p_subdomain text, p_path text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_club_id uuid;
BEGIN
  SELECT id INTO v_club_id
  FROM clubs
  WHERE subdomain = lower(trim(p_subdomain))
     OR subdomain = lower(replace(trim(p_subdomain), '-', ''))
  LIMIT 1;
  IF v_club_id IS NOT NULL THEN
    INSERT INTO club_website_views (club_id, path) VALUES (v_club_id, nullif(trim(p_path), ''));
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION record_club_page_view(text, text) TO anon;
