-- Remove image_small_url and image_large_url from events table
-- (use event cover image_url or image_url only)

ALTER TABLE events
  DROP COLUMN IF EXISTS image_small_url,
  DROP COLUMN IF EXISTS image_large_url;
