/**
 * BTW price calculator.
 *
 * Source of truth: Notion „Kalkulačka cien – preprava osôb (BTW)".
 * All prices are WITHOUT VAT (bez DPH).
 *
 * The calculation is deterministic given the places, times and a `km(from, to)`
 * lookup. Branching never depends on the km values, so the same function is
 * used both to collect the legs that need a distance lookup (see `requiredLegs`)
 * and to compute the final prices.
 */
import {
  BRATISLAVA_CENTER,
  type GeoPoint,
  type PlaceInfo,
  fixedPriceVillage,
  innerDistrict,
  isBratislava,
  isSchwechat,
  outerDistrict,
} from "./places"

export type VehicleClass = "BC" | "Van" | "FC"

// 1. Cena za kilometer
export const RATE: Record<VehicleClass, number> = {
  BC: 1.5,
  Van: 1.65,
  FC: 1.95,
}

// Operational limits (not part of the Notion price list)
export const CAPACITY: Record<VehicleClass, number> = {
  BC: 3,
  Van: 7,
  FC: 2,
}
export const MAX_PAX = 14

export const CLASS_LABEL: Record<VehicleClass, string> = {
  BC: "Business Class",
  Van: "Business Van",
  FC: "First Class",
}

// 2.1 Bratislava ↔ Schwechat (Business Class)
export const AIRPORT_BASE = 65
export const AIRPORT_PARKING_TO = 3 // Bratislava → Schwechat
export const AIRPORT_PARKING_FROM = 6 // Schwechat → Bratislava
export const OUTER_DISTRICT_SURCHARGE = 10
/** Letiskové ceny (2.1 aj 2.2) pre ostatné triedy = cena Business Class + príplatok */
export const AIRPORT_CLASS_SURCHARGE: Record<VehicleClass, number> = {
  BC: 0,
  Van: 20,
  FC: 35,
}

// 3.1 Nočný transfer (22:00 – 06:00)
export const NIGHT_SURCHARGE = 10
export const NIGHT_FROM_HOUR = 22
export const NIGHT_TO_HOUR = 6

// 3.2 Čakanie (informatívne – účtuje sa podľa skutočnosti)
export const WAITING = {
  freeAirportMin: 60,
  freeOtherMin: 30,
  perBlock: { BC: 20, Van: 25 } as Record<"BC" | "Van", number>,
}

// 4.1 Medzizastávka v Bratislave
export const INNER_WAYPOINT_FEE = 5

export type KmLookup = (from: GeoPoint, to: GeoPoint) => number

export type PriceLine = { label: string; amount: number }

export type TransferInput = {
  from: PlaceInfo
  to: PlaceInfo
  waypoints: PlaceInfo[]
  /** "HH:MM" */
  time: string
}

export type TransferPrice = {
  lines: PriceLine[]
  /** rounded to whole euros (Notion 5.) */
  total: number
}

export type TripInput = {
  pickup: PlaceInfo
  destination: PlaceInfo
  waypoints: PlaceInfo[]
  time: string
  pax: number
  isReturnTrip: boolean
  returnTime: string
  preferredClass: VehicleClass | null
}

export type Variant = {
  class: VehicleClass
  vehicleCount: number
  /** whole euros, all transfers for one vehicle */
  pricePerVehicle: number
  totalPrice: number
  /** per-vehicle breakdown */
  breakdown: PriceLine[]
  note?: string
}

// --- helpers ---

/** Notion 5.: do 0,49 dole, od 0,50 hore. Cents first to avoid float noise. */
export function roundEur(n: number): number {
  const cents = Math.round(n * 100)
  return Math.floor((cents + 50) / 100)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function fmtKm(km: number): string {
  return km.toLocaleString("sk-SK", { maximumFractionDigits: 1 })
}

function fmtRate(r: number): string {
  return r.toLocaleString("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function isNightTime(time: string): boolean {
  const m = /^(\d{2}):(\d{2})$/.exec(time)
  if (!m) return false
  const h = Number(m[1])
  return h >= NIGHT_FROM_HOUR || h < NIGHT_TO_HOUR
}

function shortName(p: PlaceInfo): string {
  if (isSchwechat(p)) return "Schwechat"
  return p.locality || p.address.split(",")[0] || p.address
}

/** Start point of a km-priced route: „so štartom v Bratislave" (Notion 1.). */
function routeStart(from: PlaceInfo): GeoPoint {
  return isBratislava(from) ? from : BRATISLAVA_CENTER
}

// --- one transfer, one vehicle ---

export function priceTransfer(t: TransferInput, cls: VehicleClass, km: KmLookup): TransferPrice {
  const lines: PriceLine[] = []
  const rate = RATE[cls]
  const start = routeStart(t.from)

  // 2. Letiskové transfery – Schwechat (ceny pre BC; Van +20 €, FC +35 €)
  const fromVie = isSchwechat(t.from)
  const toVie = isSchwechat(t.to)
  const other = fromVie && !toVie ? t.to : toVie && !fromVie ? t.from : null
  let base: "fixed" | "km" = "km"

  if (other) {
    const village = fixedPriceVillage(other)
    if (village) {
      // 2.2 Pevné ceny pre konkrétne obce – oba smery, bez parkovania
      lines.push({ label: `Pevná cena Schwechat ↔ ${village.name}`, amount: village.price })
      base = "fixed"
    } else if (isBratislava(other)) {
      // 2.1 Bratislava ↔ Schwechat
      lines.push({
        label: toVie ? "Bratislava → Schwechat" : "Schwechat → Bratislava",
        amount: AIRPORT_BASE,
      })
      lines.push({
        label: "Parkovanie na letisku",
        amount: toVie ? AIRPORT_PARKING_TO : AIRPORT_PARKING_FROM,
      })
      const outer = outerDistrict(other)
      if (outer) {
        lines.push({ label: `Príplatok – ${outer}`, amount: OUTER_DISTRICT_SURCHARGE })
      }
      base = "fixed"
    }
    if (base === "fixed" && AIRPORT_CLASS_SURCHARGE[cls] > 0) {
      lines.push({ label: `Príplatok – ${CLASS_LABEL[cls]}`, amount: AIRPORT_CLASS_SURCHARGE[cls] })
    }
  }

  if (base === "km") {
    // 1. Vzdialenosť so štartom v Bratislave × cena za km
    let distance = 0
    if (start !== t.from) distance += km(start, t.from)
    distance += km(t.from, t.to)
    distance = Math.round(distance * 10) / 10
    const label =
      start !== t.from
        ? `Bratislava → ${shortName(t.from)} → ${shortName(t.to)}: ${fmtKm(distance)} km × ${fmtRate(rate)} €`
        : `${fmtKm(distance)} km × ${fmtRate(rate)} €`
    lines.push({ label, amount: round2(distance * rate) })
  }

  // 4. Medzizastávky
  let prev: GeoPoint = start
  t.waypoints.forEach((wp, i) => {
    const inner = innerDistrict(wp)
    if (inner) {
      lines.push({ label: `Medzizastávka ${i + 1} (${inner})`, amount: INNER_WAYPOINT_FEE })
    } else {
      const d = Math.round(km(prev, wp) * 10) / 10
      const from = i === 0 ? "z Bratislavy" : `od zastávky ${i}`
      lines.push({
        label: `Medzizastávka ${i + 1} (${shortName(wp)}): ${from} ${fmtKm(d)} km × ${fmtRate(rate)} €`,
        amount: round2(d * rate),
      })
    }
    prev = wp
  })

  // 3.1 Nočný transfer – jednorazovo
  if (isNightTime(t.time)) {
    lines.push({ label: "Nočný transfer (22:00 – 06:00)", amount: NIGHT_SURCHARGE })
  }

  const exact = lines.reduce((s, l) => s + l.amount, 0)
  return { lines, total: roundEur(exact) }
}

function transfersOf(trip: TripInput): TransferInput[] {
  const out: TransferInput[] = [
    { from: trip.pickup, to: trip.destination, waypoints: trip.waypoints, time: trip.time },
  ]
  if (trip.isReturnTrip) {
    // Spiatočná cesta = samostatný transfer späť, priamo (bez medzizastávok)
    out.push({ from: trip.destination, to: trip.pickup, waypoints: [], time: trip.returnTime })
  }
  return out
}

export function pricePerVehicle(
  trip: TripInput,
  cls: VehicleClass,
  km: KmLookup,
): { total: number; breakdown: PriceLine[] } {
  const transfers = transfersOf(trip)
  const breakdown: PriceLine[] = []
  let total = 0
  transfers.forEach((t, i) => {
    const p = priceTransfer(t, cls, km)
    const prefix = transfers.length > 1 ? (i === 0 ? "Tam · " : "Späť · ") : ""
    p.lines.forEach(l => breakdown.push({ label: prefix + l.label, amount: l.amount }))
    const exact = round2(p.lines.reduce((s, l) => s + l.amount, 0))
    if (exact !== p.total) {
      breakdown.push({ label: `${prefix}Zaokrúhlenie`, amount: round2(p.total - exact) })
    }
    total += p.total
  })
  return { total, breakdown }
}

/** All distance lookups the quote will need (deduplicated by the caller). */
export function requiredLegs(trip: TripInput): Array<[GeoPoint, GeoPoint]> {
  const legs: Array<[GeoPoint, GeoPoint]> = []
  const rec: KmLookup = (a, b) => {
    legs.push([a, b])
    return 0
  }
  for (const cls of ["BC", "Van", "FC"] as VehicleClass[]) {
    pricePerVehicle(trip, cls, rec)
  }
  return legs
}

// --- variants (vehicle class × count) ---

function vehiclesNeeded(pax: number, cls: VehicleClass): number {
  return Math.ceil(pax / CAPACITY[cls])
}

function buildVariant(
  trip: TripInput,
  cls: VehicleClass,
  vehicleCount: number,
  km: KmLookup,
  note?: string,
): Variant {
  const { total, breakdown } = pricePerVehicle(trip, cls, km)
  return {
    class: cls,
    vehicleCount,
    pricePerVehicle: total,
    totalPrice: total * vehicleCount,
    breakdown,
    note,
  }
}

/**
 * Which options the customer sees:
 * - chose a class and the passengers fit → only that class (no upselling),
 * - chose a class that is too small → that class × N plus classes that fit,
 * - „Nezáleží" → every class.
 */
export function computeVariants(trip: TripInput, km: KmLookup): Variant[] {
  const { pax, preferredClass } = trip
  if (pax < 1 || pax > MAX_PAX) return []

  const classes: VehicleClass[] = ["BC", "Van", "FC"]

  if (preferredClass && pax <= CAPACITY[preferredClass]) {
    return [buildVariant(trip, preferredClass, 1, km)]
  }

  if (preferredClass && pax > CAPACITY[preferredClass]) {
    const n = vehiclesNeeded(pax, preferredClass)
    const multi = buildVariant(trip, preferredClass, n, km, `${n}× ${CLASS_LABEL[preferredClass]}`)
    const upgrades = classes
      .filter(c => c !== preferredClass && pax <= CAPACITY[c])
      .map(c => buildVariant(trip, c, 1, km, `Upgrade na ${CLASS_LABEL[c]}`))
    const multiUpgrades = classes
      .filter(c => c !== preferredClass && pax > CAPACITY[c] && vehiclesNeeded(pax, c) < n)
      .map(c => {
        const k = vehiclesNeeded(pax, c)
        return buildVariant(trip, c, k, km, `${k}× ${CLASS_LABEL[c]}`)
      })
    return [multi, ...upgrades, ...multiUpgrades]
  }

  return classes.map(c => {
    const count = vehiclesNeeded(pax, c)
    return buildVariant(trip, c, count, km, count > 1 ? `${count}× ${CLASS_LABEL[c]}` : undefined)
  })
}
