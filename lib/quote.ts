import { computeLegs, round1, type DistanceResult } from "./distance"
import type { PlaceInfo } from "./places"
import {
  CAPACITY,
  MAX_PAX,
  computeVariants,
  pricePerVehicle,
  requiredLegs,
  type TripInput,
  type Variant,
  type VehicleClass,
} from "./pricing"

export type Quote = {
  /** pickup → waypoints → destination, one way (for display) */
  distance: DistanceResult
  variants: Variant[]
}

const CLASSES: VehicleClass[] = ["BC", "Van", "FC"]

function str(v: unknown, max = 300): string | undefined {
  return typeof v === "string" && v.length > 0 ? v.slice(0, max) : undefined
}

export function parsePlace(v: unknown): PlaceInfo | null {
  if (!v || typeof v !== "object") return null
  const o = v as Record<string, unknown>
  if (typeof o.placeId !== "string" || !o.placeId) return null
  if (typeof o.lat !== "number" || typeof o.lng !== "number") return null
  if (!Number.isFinite(o.lat) || !Number.isFinite(o.lng)) return null
  return {
    placeId: o.placeId.slice(0, 300),
    lat: o.lat,
    lng: o.lng,
    address: str(o.address, 500) ?? "",
    types: Array.isArray(o.types) ? o.types.filter((t): t is string => typeof t === "string").slice(0, 20) : [],
    locality: str(o.locality),
    sublocality: str(o.sublocality),
    postalCode: str(o.postalCode, 20),
  }
}

/** Validates the untrusted request body into a TripInput, or returns an error message. */
export function parseTrip(v: unknown): TripInput | string {
  if (!v || typeof v !== "object") return "Neplatná trasa."
  const o = v as Record<string, unknown>
  const pickup = parsePlace(o.pickup)
  const destination = parsePlace(o.destination)
  if (!pickup || !destination) return "Vyzdvihnutie aj cieľ musia byť vybrané z návrhov."
  const rawWps = Array.isArray(o.waypoints) ? o.waypoints : []
  if (rawWps.length > 5) return "Maximálne 5 medzizastávok."
  const waypoints = rawWps.map(parsePlace)
  if (waypoints.some(w => w === null)) return "Medzizastávky musia byť vybrané z návrhov."
  const pax = typeof o.pax === "number" && Number.isInteger(o.pax) ? o.pax : 0
  const time = typeof o.time === "string" ? o.time : ""
  const isReturnTrip = o.isReturnTrip === true
  const returnTime = typeof o.returnTime === "string" ? o.returnTime : ""
  const preferredClass = CLASSES.includes(o.preferredClass as VehicleClass)
    ? (o.preferredClass as VehicleClass)
    : null
  return {
    pickup,
    destination,
    waypoints: waypoints as PlaceInfo[],
    time,
    pax,
    isReturnTrip,
    returnTime,
    preferredClass,
  }
}

export async function quoteTrip(trip: TripInput): Promise<Quote> {
  const stops = [trip.pickup, ...trip.waypoints, trip.destination]
  const routeLegs = stops.slice(0, -1).map((s, i) => [s, stops[i + 1]] as [PlaceInfo, PlaceInfo])
  const legs = await computeLegs([...routeLegs, ...requiredLegs(trip)])

  const km = routeLegs.reduce((s, [a, b]) => s + legs.km(a, b), 0)
  const durationSec = routeLegs.reduce((s, [a, b]) => s + legs.durationSec(a, b), 0)

  return {
    distance: { km: round1(km), durationSec, source: legs.source },
    variants: computeVariants(trip, legs.km),
  }
}

/**
 * Authoritative price for the variant the customer picked (used by /api/order).
 * Returns null when the class / vehicle count can't carry the passengers.
 */
export async function priceSelection(
  trip: TripInput,
  cls: VehicleClass,
  vehicleCount: number,
): Promise<{ variant: Variant; distance: DistanceResult } | null> {
  if (!CLASSES.includes(cls)) return null
  if (!Number.isInteger(vehicleCount) || vehicleCount < 1 || vehicleCount > MAX_PAX) return null
  if (trip.pax < 1 || trip.pax > MAX_PAX || CAPACITY[cls] * vehicleCount < trip.pax) return null

  const stops = [trip.pickup, ...trip.waypoints, trip.destination]
  const routeLegs = stops.slice(0, -1).map((s, i) => [s, stops[i + 1]] as [PlaceInfo, PlaceInfo])
  const legs = await computeLegs([...routeLegs, ...requiredLegs(trip)])
  const { total, breakdown } = pricePerVehicle(trip, cls, legs.km)

  return {
    variant: {
      class: cls,
      vehicleCount,
      pricePerVehicle: total,
      totalPrice: total * vehicleCount,
      breakdown,
    },
    distance: {
      km: round1(routeLegs.reduce((s, [a, b]) => s + legs.km(a, b), 0)),
      durationSec: routeLegs.reduce((s, [a, b]) => s + legs.durationSec(a, b), 0),
      source: legs.source,
    },
  }
}
