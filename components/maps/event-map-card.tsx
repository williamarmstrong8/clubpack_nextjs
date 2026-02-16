import { cn } from "@/lib/utils"
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
    <div className={cn("overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300", className)}>
      {/* Static map image (only when token is set) — flush to top */}
      {staticMapUrl ? (
        <div className="relative aspect-[5/3] w-full overflow-hidden">
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
        <div className="relative flex aspect-[5/3] w-full items-center justify-center overflow-hidden bg-gray-100 text-sm text-gray-600">
          Map preview requires NEXT_PUBLIC_MAPBOX_TOKEN
        </div>
      )}

      {/* Location name + navigation — same block style as RSVP and Details */}
      <div className="border-t border-gray-200 p-6 lg:p-8 space-y-3">
        {locationName && (
          <div className="flex items-start gap-2">
            <MapPin className="size-5 mt-0.5 shrink-0 text-gray-500" />
            <span className="text-base font-medium text-gray-900 leading-relaxed">{locationName}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-none border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
          >
            <Navigation className="size-4" />
            Google Maps
          </a>
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-none border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
          >
            <Navigation className="size-4" />
            Apple Maps
          </a>
        </div>
      </div>
    </div>
  )
}
