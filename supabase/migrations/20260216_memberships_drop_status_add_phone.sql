-- memberships: remove status, add phone
-- Note: auth_user_id is kept — it links this membership row to the auth user;
-- id is the membership row's primary key, not the same as auth_user_id.

-- Drop policy that depends on memberships.status (members can read events for their club)
DROP POLICY IF EXISTS member_read_events ON events;

ALTER TABLE memberships
  DROP COLUMN IF EXISTS status,
  ADD COLUMN IF NOT EXISTS phone text;

-- Recreate: members can read events for clubs they belong to (no status check)
CREATE POLICY member_read_events ON events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.club_id = events.club_id
        AND memberships.auth_user_id = auth.uid()
    )
  );
