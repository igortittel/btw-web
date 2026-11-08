import { NextResponse } from "next/server"
import { computeRouteDistance, checkRateLimit } from "@/lib/distance"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type PlaceInput = {
  placeId: string
  lat: number
  lng: number
}

type Body = {
  pickup: PlaceInput
  destination: PlaceInput
  waypoints?: PlaceInput[]
}

function isValidPlace(p: unknown): p is PlaceInput {
  if (!p || typeof p !== "object") return false
  const o = p as Record<string, unknown>
  return (
    typeof o.placeId === "string" &&
    o.placeId.length > 0 &&
    typeof o.lat === "number" &&
    typeof o.lng === "number" &&
    Number.isFinite(o.lat) &&
    Number.isFinite(o.lng)
  )
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Prekročili ste limit volaní. Skúste o chvíľu znova." },
      { status: 429 },
    )
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 })
  }

  if (!isValidPlace(body.pickup) || !isValidPlace(body.destination)) {
    return NextResponse.json(
      { error: "Pickup aj destination musia obsahovať placeId + lat/lng." },
      { status: 400 },
    )
  }

  const waypoints = Array.isArray(body.waypoints)
    ? body.waypoints.filter(isValidPlace)
    : []

  if (waypoints.length > 5) {
    return NextResponse.json(
      { error: "Maximálne 5 medzizastávok." },
      { status: 400 },
    )
  }

  try {
    const result = await computeRouteDistance(body.pickup, body.destination, waypoints)
    return NextResponse.json(result)
  } catch (err) {
    console.error("[api/distance] unexpected error", err)
    return NextResponse.json(
      { error: "Interná chyba pri výpočte vzdialenosti." },
      { status: 500 },
    )
  }
}
