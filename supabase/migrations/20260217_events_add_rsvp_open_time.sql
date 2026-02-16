-- Add optional RSVP open time: before this time, RSVPs are disabled on the event page
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS rsvp_open_time TIMESTAMPTZ;
