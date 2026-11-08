export type DistanceSource = "google" | "haversine"

export type LatLng = { lat: number; lng: number }

export type DistanceResult = {
  km: number
  durationSec: number
  source: DistanceSource
}

const HAVERSINE_ROAD_FACTOR = 1.3
const EARTH_RADIUS_KM = 6371
const DISTANCE_MATRIX_TIMEOUT_MS = 3000

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
    process.env.GOOGLE_DISTANCE_MATRIX_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    null
  )
}

type GoogleLegInput = { origin: string; destination: string }

async function fetchGoogleLeg(
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
 * Compute route distance across pickup → waypoints → destination.
 * Each place is addressed by Google Place ID ("place_id:<id>" format accepted by API).
 * Falls back to haversine × 1.3 when API key missing, timeout, or any leg fails.
 */
export async function computeRouteDistance(
  pickup: { placeId: string; lat: number; lng: number },
  destination: { placeId: string; lat: number; lng: number },
  waypoints: Array<{ placeId: string; lat: number; lng: number }>,
): Promise<DistanceResult> {
  const apiKey = getApiKey()
  const allPoints: LatLng[] = [
    { lat: pickup.lat, lng: pickup.lng },
    ...waypoints.map(w => ({ lat: w.lat, lng: w.lng })),
    { lat: destination.lat, lng: destination.lng },
  ]

  if (!apiKey) {
    return {
      km: round1(haversineRouteKm(allPoints)),
      durationSec: estimateDurationSec(haversineRouteKm(allPoints)),
      source: "haversine",
    }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DISTANCE_MATRIX_TIMEOUT_MS)
  try {
    const stops = [pickup, ...waypoints, destination]
    const legs: GoogleLegInput[] = []
    for (let i = 0; i < stops.length - 1; i++) {
      legs.push({
        origin: `place_id:${stops[i].placeId}`,
        destination: `place_id:${stops[i + 1].placeId}`,
      })
    }
    const results = await Promise.all(
      legs.map(leg => fetchGoogleLeg(leg, apiKey, controller.signal)),
    )
    if (results.some(r => r === null)) {
      return haversineFallback(allPoints)
    }
    const totalMeters = results.reduce((sum, r) => sum + (r?.meters ?? 0), 0)
    const totalSeconds = results.reduce((sum, r) => sum + (r?.seconds ?? 0), 0)
    return {
      km: round1(totalMeters / 1000),
      durationSec: totalSeconds,
      source: "google",
    }
  } catch {
    return haversineFallback(allPoints)
  } finally {
    clearTimeout(timer)
  }
}

function haversineFallback(points: LatLng[]): DistanceResult {
  const km = haversineRouteKm(points)
  return {
    km: round1(km),
    durationSec: estimateDurationSec(km),
    source: "haversine",
  }
}

function estimateDurationSec(km: number): number {
  const avgSpeedKmh = 70
  return Math.round((km / avgSpeedKmh) * 3600)
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

// --- Simple in-memory rate limiter for /api/distance (per-IP, 20 req/min) ---

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
