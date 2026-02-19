-- memberships: add waiver_url and waiver_signed_at for club-site waiver uploads
-- Used by account settings (upload signed waiver) and event RSVP (require waiver to RSVP).

ALTER TABLE memberships
  ADD COLUMN IF NOT EXISTS waiver_url text,
  ADD COLUMN IF NOT EXISTS waiver_signed_at timestamptz;
