/**
 * Classification of Google Places results for the BTW price calculator.
 * Shared by client (preview) and server (authoritative quote).
 *
 * Source of truth for the zone lists: Notion „Kalkulačka cien – preprava osôb (BTW)".
 */

export type GeoPoint = {
  placeId?: string
  lat: number
  lng: number
}

export type PlaceInfo = GeoPoint & {
  address: string
  placeId: string
  types?: string[]
  /** address_components → locality (e.g. "Bratislava", "Senec", "Schwechat") */
  locality?: string
  /** address_components → sublocality_level_1 / neighborhood (e.g. "Petržalka") */
  sublocality?: string
  /** address_components → postal_code (e.g. "851 01") */
  postalCode?: string
}

export const SCHWECHAT_PLACE_ID = "ChIJIyJbg7CobUcRRMCkW0UcVFM"

/** Reference point „Bratislava" (Hlavné námestie) for routes that start outside the city. */
export const BRATISLAVA_CENTER: GeoPoint = { lat: 48.1435, lng: 17.1088 }

export function normalize(s: string | undefined | null): string {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/mestska cast|bratislava\s*-\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function compactPostal(p: string | undefined): string {
  return (p || "").replace(/\s+/g, "")
}

// --- Zone lists (Notion) ---

/** 2.1 – príplatok +10 € pri transfere Bratislava ↔ Schwechat */
export const OUTER_DISTRICTS = [
  "Devín",
  "Devínska Nová Ves",
  "Záhorská Bystrica",
  "Čunovo",
  "Vajnory",
  "Rusovce",
  "Jarovce",
  "Karlova Ves",
  "Dúbravka",
] as const

/** 4.1 – medzizastávka v Bratislave za paušál +5 € */
export const INNER_DISTRICTS = [
  "Staré Mesto",
  "Nové Mesto",
  "Ružinov",
  "Vrakuňa",
  "Petržalka",
  "Podunajské Biskupice",
  "Rača",
  "Lamač",
  "Trnávka",
] as const

/** 2.2 – pevné ceny Schwechat ↔ obec (Business Class, oba smery, bez parkovania) */
export const VILLAGE_PRICES: Array<{ name: string; price: number }> = [
  { name: "Šamorín", price: 99 },
  { name: "Stupava", price: 105 },
  { name: "Svätý Jur", price: 110 },
  { name: "Vinosady", price: 115 },
  { name: "Bernolákovo", price: 120 },
  { name: "Senec", price: 125 },
  { name: "Kostolište", price: 150 },
  { name: "Miloslavov", price: 115 },
  { name: "Veľká Paka", price: 135 },
]

// Postal codes used only as a fallback when Google gives no sublocality.
const OUTER_POSTAL: Record<string, string> = {
  "84110": "Devín",
  "84107": "Devínska Nová Ves",
  "84106": "Záhorská Bystrica",
  "83107": "Vajnory",
  "85110": "Jarovce / Rusovce / Čunovo",
  "84101": "Dúbravka",
  "84102": "Dúbravka",
  "84104": "Karlova Ves",
  "84105": "Karlova Ves",
}
const INNER_POSTAL_PREFIX: Array<[string, string]> = [
  ["811", "Staré Mesto"],
  ["821", "Ružinov / Vrakuňa / Podunajské Biskupice"],
  ["831", "Nové Mesto / Rača"],
  ["84103", "Lamač"],
  ["8510", "Petržalka"],
]

function matchDistrict(place: PlaceInfo, list: readonly string[]): string | null {
  const sub = normalize(place.sublocality)
  const addr = normalize(place.address)
  for (const d of list) {
    const n = normalize(d)
    if (sub && (sub === n || sub.includes(n))) return d
  }
  for (const d of list) {
    const n = normalize(d)
    if (new RegExp(`(^|[^a-z])${n}([^a-z]|$)`).test(addr)) return d
  }
  return null
}

// --- Classifiers ---

export function isSchwechat(place: PlaceInfo): boolean {
  if (place.placeId === SCHWECHAT_PLACE_ID) return true
  const isAirport = place.types?.includes("airport") ?? false
  if (!isAirport) return false
  const hay = `${normalize(place.locality)} ${normalize(place.address)}`
  return /schwechat|wien|vienna|flughafen/.test(hay)
}

export function isBratislava(place: PlaceInfo): boolean {
  if (isSchwechat(place)) return false
  const loc = normalize(place.locality)
  if (loc) return loc.startsWith("bratislava")
  const pc = compactPostal(place.postalCode)
  if (/^8\d{4}$/.test(pc)) return true
  return /(^|[^a-z])bratislava([^a-z]|$)/.test(normalize(place.address))
}

/** District from the Notion list 2.1 (+10 € for airport transfers), or null. */
export function outerDistrict(place: PlaceInfo): string | null {
  if (!isBratislava(place)) return null
  const byName = matchDistrict(place, OUTER_DISTRICTS)
  if (byName) return byName
  if (place.sublocality) return null
  return OUTER_POSTAL[compactPostal(place.postalCode)] ?? null
}

/** District from the Notion list 4.1 (waypoint +5 €), or null. */
export function innerDistrict(place: PlaceInfo): string | null {
  if (!isBratislava(place)) return null
  const byName = matchDistrict(place, INNER_DISTRICTS)
  if (byName) return byName
  if (place.sublocality) return null
  const pc = compactPostal(place.postalCode)
  if (!pc || OUTER_POSTAL[pc]) return null
  for (const [prefix, label] of INNER_POSTAL_PREFIX) {
    if (pc.startsWith(prefix)) return label
  }
  return null
}

/** Fixed-price municipality from Notion 2.2, or null. */
export function fixedPriceVillage(place: PlaceInfo): { name: string; price: number } | null {
  if (isBratislava(place) || isSchwechat(place)) return null
  const loc = normalize(place.locality)
  for (const v of VILLAGE_PRICES) {
    const n = normalize(v.name)
    if (loc) {
      if (loc === n) return v
      continue
    }
    if (new RegExp(`(^|[^a-z])${n}([^a-z]|$)`).test(normalize(place.address))) return v
  }
  return null
}

export function pointKey(p: GeoPoint): string {
  return p.placeId ? `place_id:${p.placeId}` : `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`
}
