export type DistanceSource = "google" | "haversine"

export type LatLng = { lat: number; lng: number }

export type DistanceResult = {
  km: number
  durationSec: number
  source: DistanceSource
}

const HAVERSINE_ROAD_FACTOR = 1.3
const EARTH_RADIUS_KM = 6371
const DISTANCE_MATRIX_TIMEOUT_MS = 5000

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function haversineRouteKm(points: LatLng[]): number {
  let total = 0
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineKm(points[i], points[i + 1])
  }
  return total * HAVERSINE_ROAD_FACTOR
}

function getApiKey(): string | null {
  return (
    process.env.GOOGLE_ROUTES_API_KEY ||
    process.env.GOOGLE_DISTANCE_MATRIX_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    null
  )
}

type GoogleLegInput = { origin: string; destination: string }

function routesWaypoint(ref: string): Record<string, unknown> {
  if (ref.startsWith("place_id:")) return { placeId: ref.slice("place_id:".length) }
  const [lat, lng] = ref.split(",").map(Number)
  return { location: { latLng: { latitude: lat, longitude: lng } } }
}

/** Google Routes API (computeRoutes) – the current, non-legacy API. */
async function fetchRoutesLeg(
  { origin, destination }: GoogleLegInput,
  apiKey: string,
  signal: AbortSignal,
): Promise<{ meters: number; seconds: number } | null> {
  const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    signal,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({
      origin: routesWaypoint(origin),
      destination: routesWaypoint(destination),
      travelMode: "DRIVE",
      languageCode: "sk",
    }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { routes?: Array<{ distanceMeters?: number; duration?: string }> }
  const r = data.routes?.[0]
  if (!r || typeof r.distanceMeters !== "number") return null
  const seconds = Number.parseInt((r.duration || "0s").replace("s", ""), 10) || 0
  return { meters: r.distanceMeters, seconds }
}

/** Routes API first; legacy Distance Matrix as a second chance. */
async function fetchGoogleLeg(
  leg: GoogleLegInput,
  apiKey: string,
  signal: AbortSignal,
): Promise<{ meters: number; seconds: number } | null> {
  const viaRoutes = await fetchRoutesLeg(leg, apiKey, signal).catch(() => null)
  if (viaRoutes) return viaRoutes
  return fetchDistanceMatrixLeg(leg, apiKey, signal)
}

async function fetchDistanceMatrixLeg(
  { origin, destination }: GoogleLegInput,
  apiKey: string,
  signal: AbortSignal,
): Promise<{ meters: number; seconds: number } | null> {
  const params = new URLSearchParams({
    origins: origin,
    destinations: destination,
    mode: "driving",
    units: "metric",
    language: "sk",
    key: apiKey,
  })
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`
  const res = await fetch(url, { signal, cache: "no-store" })
  if (!res.ok) return null
  const data = (await res.json()) as {
    status: string
    rows?: Array<{
      elements?: Array<{
        status: string
        distance?: { value: number }
        duration?: { value: number }
      }>
    }>
  }
  if (data.status !== "OK") return null
  const el = data.rows?.[0]?.elements?.[0]
  if (!el || el.status !== "OK" || !el.distance || !el.duration) return null
  return { meters: el.distance.value, seconds: el.duration.value }
}

/**
 * Distance for a set of legs (each leg = from → to). Duplicate legs are fetched once.
 * Points with a placeId are addressed as "place_id:<id>", others by "lat,lng".
 * Any leg Google can't answer falls back to haversine × 1.3 and marks the
 * whole result as "haversine" (estimate).
 */
export type LegPoint = { placeId?: string; lat: number; lng: number }

export type LegsResult = {
  km: (from: LegPoint, to: LegPoint) => number
  durationSec: (from: LegPoint, to: LegPoint) => number
  source: DistanceSource
}

function pointRef(p: LegPoint): string {
  return p.placeId ? `place_id:${p.placeId}` : `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`
}

function legKey(a: LegPoint, b: LegPoint): string {
  return `${pointRef(a)}|${pointRef(b)}`
}

export async function computeLegs(legs: Array<[LegPoint, LegPoint]>): Promise<LegsResult> {
  const unique = new Map<string, [LegPoint, LegPoint]>()
  for (const [a, b] of legs) unique.set(legKey(a, b), [a, b])

  const results = new Map<string, { km: number; sec: number }>()
  let source: DistanceSource = "google"
  const apiKey = getApiKey()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DISTANCE_MATRIX_TIMEOUT_MS)

  try {
    await Promise.all(
      Array.from(unique.entries()).map(async ([key, [a, b]]) => {
        if (pointRef(a) === pointRef(b)) {
          results.set(key, { km: 0, sec: 0 })
          return
        }
        let r: { meters: number; seconds: number } | null = null
        if (apiKey) {
          try {
            r = await fetchGoogleLeg(
              { origin: pointRef(a), destination: pointRef(b) },
              apiKey,
              controller.signal,
            )
          } catch {
            r = null
          }
        }
        if (r) {
          results.set(key, { km: r.meters / 1000, sec: r.seconds })
        } else {
          source = "haversine"
          const km = haversineRouteKm([a, b])
          results.set(key, { km, sec: estimateDurationSec(km) })
        }
      }),
    )
  } finally {
    clearTimeout(timer)
  }

  const get = (a: LegPoint, b: LegPoint) => {
    const hit = results.get(legKey(a, b))
    if (hit) return hit
    const km = haversineRouteKm([a, b])
    return { km, sec: estimateDurationSec(km) }
  }
  return {
    km: (a, b) => get(a, b).km,
    durationSec: (a, b) => get(a, b).sec,
    source,
  }
}

function estimateDurationSec(km: number): number {
  const avgSpeedKmh = 70
  return Math.round((km / avgSpeedKmh) * 3600)
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

// --- Simple in-memory rate limiter for /api/quote (per-IP, 20 req/min) ---

const buckets = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 20

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const bucket = buckets.get(ip)
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (bucket.count >= RATE_LIMIT) return false
  bucket.count++
  return true
}
