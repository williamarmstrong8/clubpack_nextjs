"use client"

import * as React from "react"
import { MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface LocationSelection {
  location_name: string
  latitude: number
  longitude: number
}

interface LocationSearchProps {
  value: string
  onSelect: (selection: LocationSelection) => void
  placeholder?: string
  className?: string
}

interface MapboxFeature {
  id: string
  place_name: string
  center: [number, number] // [lng, lat]
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export function LocationSearch({
  value,
  onSelect,
  placeholder = "Search address or place",
  className,
}: LocationSearchProps) {
  const [query, setQuery] = React.useState<string>(value || "")
  const [results, setResults] = React.useState<MapboxFeature[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setQuery(value || "")
  }, [value])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 3) {
        setResults([])
        setErrorMsg(null)
        return
      }
      if (!MAPBOX_TOKEN) {
        setResults([])
        setErrorMsg("Set NEXT_PUBLIC_MAPBOX_TOKEN to enable location search.")
        return
      }
      setIsLoading(true)
      try {
        const encoded = encodeURIComponent(debouncedQuery.trim())
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=8&types=address,poi,place,locality,neighborhood,region,district`
        const res = await fetch(url)
        if (!res.ok) {
          let message = `Location search failed (status ${res.status})`
          if (res.status === 401 || res.status === 403) {
            message =
              "Mapbox token rejected. Check token restrictions and scopes."
          }
          setResults([])
          setErrorMsg(message)
          return
        }
        const data = await res.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features: MapboxFeature[] = (data?.features || []).map((f: any) => ({
          id: f.id,
          place_name: f.place_name,
          center: f.center,
        }))
        setResults(features)
        setErrorMsg(null)
      } catch (err) {
        console.error("Mapbox geocoding error:", err)
        setErrorMsg("Unable to reach Mapbox. Please check your network.")
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchSuggestions()
  }, [debouncedQuery])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && query.trim().length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-72 overflow-auto">
          {query.trim().length < 3 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Type at least 3 characters…
            </div>
          )}
          {query.trim().length >= 3 && isLoading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching…
            </div>
          )}
          {query.trim().length >= 3 && !isLoading && errorMsg && (
            <div className="px-3 py-2 text-sm text-destructive">
              {errorMsg}
            </div>
          )}
          {query.trim().length >= 3 &&
            !isLoading &&
            !errorMsg &&
            results.map((r) => (
              <button
                key={r.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-start gap-2"
                onClick={() => {
                  setQuery(r.place_name)
                  setIsOpen(false)
                  onSelect({
                    location_name: r.place_name,
                    latitude: r.center[1],
                    longitude: r.center[0],
                  })
                }}
              >
                <MapPin className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <span>{r.place_name}</span>
              </button>
            ))}
          {query.trim().length >= 3 &&
            !isLoading &&
            !errorMsg &&
            results.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No results
              </div>
            )}
        </div>
      )}
    </div>
  )
}
