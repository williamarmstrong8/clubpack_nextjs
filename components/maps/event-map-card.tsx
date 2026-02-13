import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

interface EventMapCardProps {
  latitude: number
  longitude: number
  locationName?: string | null
  /** Mapbox Static Images API zoom level (1–20). Default: 14 */
  zoom?: number
  className?: string
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

/**
 * Reusable map card that shows a Mapbox static map image with a marker pin
 * plus "Open in Google Maps" and "Open in Apple Maps" navigation buttons.
 *
 * This is a Server Component by default — no client JS needed.
 */
export function EventMapCard({
  latitude,
  longitude,
  locationName,
  zoom = 14,
  className,
}: EventMapCardProps) {
  const lngLat = `${longitude},${latitude}`
  const markerHex = "ef4444"
  const staticMapUrl = MAPBOX_TOKEN
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+${markerHex}(${lngLat})/${lngLat},${zoom},0/600x360@2x?access_token=${MAPBOX_TOKEN}`
    : null

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  const appleMapsUrl = `https://maps.apple.com/?q=${latitude},${longitude}`

  return (
    <Card className={className}>
      <CardContent className="p-0 overflow-hidden">
        {/* Static map image (only when token is set) */}
        {staticMapUrl ? (
          <div className="relative aspect-[5/3] w-full overflow-hidden rounded-t-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticMapUrl}
              alt={
                locationName
                  ? `Map of ${locationName}`
                  : `Map at ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
              }
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative flex aspect-[5/3] w-full items-center justify-center overflow-hidden rounded-t-xl bg-muted text-sm text-muted-foreground">
            Map preview requires NEXT_PUBLIC_MAPBOX_TOKEN
          </div>
        )}

        {/* Location name + navigation buttons */}
        <div className="p-4 space-y-3">
          {locationName && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span className="font-medium">{locationName}</span>
            </div>
          )}

          <div className="flex gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Navigation className="size-3" />
              Google Maps
            </a>
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Navigation className="size-3" />
              Apple Maps
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
