import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/distance"
import { parseTrip, quoteTrip } from "@/lib/quote"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 })
  }

  const trip = parseTrip(body)
  if (typeof trip === "string") {
    return NextResponse.json({ error: trip }, { status: 400 })
  }

  try {
    const quote = await quoteTrip(trip)
    return NextResponse.json(quote)
  } catch (err) {
    console.error("[api/quote] unexpected error", err)
    return NextResponse.json(
      { error: "Interná chyba pri výpočte ceny." },
      { status: 500 },
    )
  }
}
