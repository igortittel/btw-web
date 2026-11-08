export type VehicleClass = "BC" | "Van" | "FC"

export const RATE: Record<VehicleClass, number> = {
  BC: 1.55,
  Van: 1.75,
  FC: 1.95,
}

export const CAPACITY: Record<VehicleClass, number> = {
  BC: 3,
  Van: 7,
  FC: 2,
}

export const CLASS_LABEL: Record<VehicleClass, string> = {
  BC: "Business Class",
  Van: "Business Van",
  FC: "First Class",
}

export const MIN_BASE = 20
export const MIN_AIRPORT = 65
export const WAYPOINT_SURCHARGE = 10
export const MAX_PAX = 14

export type Variant = {
  class: VehicleClass
  vehicleCount: number
  pricePerVehicle: number
  totalPrice: number
  isRecommended?: boolean
  note?: string
}

export type ComputeInput = {
  km: number
  pax: number
  destIsAirport: boolean
  isReturnTrip: boolean
  waypointCount: number
  preferredClass: VehicleClass | null
}

export function pricePerVehicle(km: number, cls: VehicleClass, destIsAirport: boolean): number {
  const raw = km * RATE[cls]
  const min = destIsAirport ? MIN_AIRPORT : MIN_BASE
  return Math.max(raw, min)
}

export function totalForVariant(
  km: number,
  cls: VehicleClass,
  vehicleCount: number,
  destIsAirport: boolean,
  isReturnTrip: boolean,
  waypointCount: number,
): number {
  const effectiveKm = isReturnTrip ? km * 2 : km
  const base = pricePerVehicle(effectiveKm, cls, destIsAirport) * vehicleCount
  const surcharge = waypointCount * WAYPOINT_SURCHARGE
  return round2(base + surcharge)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function vehiclesNeeded(pax: number, cls: VehicleClass): number {
  return Math.ceil(pax / CAPACITY[cls])
}

function buildVariant(input: ComputeInput, cls: VehicleClass, vehicleCount: number, note?: string): Variant {
  const effectiveKm = input.isReturnTrip ? input.km * 2 : input.km
  const perVehicle = pricePerVehicle(effectiveKm, cls, input.destIsAirport)
  const total = totalForVariant(input.km, cls, vehicleCount, input.destIsAirport, input.isReturnTrip, input.waypointCount)
  return {
    class: cls,
    vehicleCount,
    pricePerVehicle: round2(perVehicle),
    totalPrice: total,
    note,
  }
}

function markCheapest(variants: Variant[]): Variant[] {
  if (variants.length === 0) return variants
  const minPrice = Math.min(...variants.map(v => v.totalPrice))
  return variants.map(v => ({ ...v, isRecommended: v.totalPrice === minPrice }))
}

export function computeVariants(input: ComputeInput): Variant[] {
  const { pax, preferredClass } = input

  if (pax < 1 || pax > MAX_PAX) {
    return []
  }

  const classes: VehicleClass[] = ["BC", "Van", "FC"]

  if (preferredClass && pax <= CAPACITY[preferredClass]) {
    const main = buildVariant(input, preferredClass, 1)
    const alternatives = classes
      .filter(c => c !== preferredClass && pax <= CAPACITY[c])
      .map(c => buildVariant(input, c, 1))
    return markCheapest([main, ...alternatives])
  }

  if (preferredClass && pax > CAPACITY[preferredClass]) {
    const multi = buildVariant(input, preferredClass, vehiclesNeeded(pax, preferredClass), `${vehiclesNeeded(pax, preferredClass)}× ${CLASS_LABEL[preferredClass]}`)
    const upgrades = classes
      .filter(c => c !== preferredClass && pax <= CAPACITY[c])
      .map(c => buildVariant(input, c, 1, `Upgrade na ${CLASS_LABEL[c]}`))
    const multiUpgrades = classes
      .filter(c => c !== preferredClass && pax > CAPACITY[c] && vehiclesNeeded(pax, c) < vehiclesNeeded(pax, preferredClass))
      .map(c => buildVariant(input, c, vehiclesNeeded(pax, c), `${vehiclesNeeded(pax, c)}× ${CLASS_LABEL[c]}`))
    return markCheapest([multi, ...upgrades, ...multiUpgrades])
  }

  // No preference — show all 3 classes, each with vehiclesNeeded
  const variants = classes.map(c => {
    const count = vehiclesNeeded(pax, c)
    const note = count > 1 ? `${count}× ${CLASS_LABEL[c]}` : undefined
    return buildVariant(input, c, count, note)
  })
  return markCheapest(variants)
}

/**
 * Serverside re-verification — accepts the frontend-submitted variant,
 * recomputes expected total, returns true if within tolerance.
 */
export function verifyVariantPrice(
  input: ComputeInput,
  submittedVariant: { class: VehicleClass; vehicleCount: number; totalPrice: number },
  toleranceEur = 1,
): boolean {
  const expected = totalForVariant(
    input.km,
    submittedVariant.class,
    submittedVariant.vehicleCount,
    input.destIsAirport,
    input.isReturnTrip,
    input.waypointCount,
  )
  return Math.abs(expected - submittedVariant.totalPrice) <= toleranceEur
}
