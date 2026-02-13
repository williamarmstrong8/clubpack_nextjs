-- Add latitude and longitude columns to the events table for Mapbox integration
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Index for spatial/location-based queries
CREATE INDEX IF NOT EXISTS events_location_coords_idx ON events(latitude, longitude);
