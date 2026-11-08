import { type NextRequest, NextResponse } from "next/server"
import { verifyVariantPrice, CLASS_LABEL, type VehicleClass } from "@/lib/pricing"
import { isAirportPlace } from "@/lib/schwechat"

export const runtime = "nodejs"

type PlaceDTO = { address: string; placeId: string; lat: number; lng: number; types?: string[] }
type OrderBody = {
  trip: {
    pickup: PlaceDTO
    destination: PlaceDTO
    waypoints: PlaceDTO[]
    date: string
    time: string
    pax: number
    isReturnTrip: boolean
    returnDate: string
    returnTime: string
    personType: "individual" | "company"
  }
  distance: { km: number; durationSec: number; source: "google" | "haversine" }
  variant: {
    class: VehicleClass
    vehicleCount: number
    pricePerVehicle: number
    totalPrice: number
  }
  customer: {
    firstName: string
    lastName: string
    companyName: string
    email: string
    phone: string
    isDifferentMainPassenger: boolean
    mainPassengerFirstName: string
    mainPassengerLastName: string
    flightNumber: string
    orderReference: string
    paymentMethod: "cash" | "card" | "invoice"
    notes: string
  }
  consents: { gdpr: boolean; marketing: boolean }
  meta: { startedAt: number; source: string }
  website?: string
}

const PAYMENT_LABEL: Record<OrderBody["customer"]["paymentMethod"], string> = {
  cash: "Hotovosťou na mieste",
  card: "Platobnou kartou",
  invoice: "Faktúrou",
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatEur(n: number): string {
  return new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function buildAdminHtml(body: OrderBody, logoUrl: string): string {
  const { trip, distance, variant, customer } = body
  const route = [trip.pickup.address, ...trip.waypoints.map(w => w.address), trip.destination.address]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br/>→ ")
  const mp = customer.isDifferentMainPassenger
    ? `${escapeHtml(customer.mainPassengerFirstName)} ${escapeHtml(customer.mainPassengerLastName)}`
    : "zhodný s objednávateľom"
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; background:#f5f5f5;">
      ${logoUrl ? `<div style="text-align:center;margin:0 0 14px;"><img src="${logoUrl}" alt="BY THE WAVE" width="120" height="40" style="display:inline-block;max-width:120px;height:auto;"/></div>` : ""}
      <div style="background:linear-gradient(135deg,#B88746 0%,#A67C52 100%);padding:28px 20px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;font-weight:bold;">Nová objednávka</h1>
        <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:13px;letter-spacing:1px;">zdroj: /objednavka · ${new Date().toLocaleString("sk-SK")}</p>
      </div>

      <div style="background:white;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <div style="background:#f8f9fa;padding:20px;border-left:5px solid #B88746;border-radius:6px;">
          <h3 style="margin:0 0 10px;color:#333;font-size:16px;">Cenová ponuka</h3>
          <table style="width:100%;font-size:14px;color:#333;">
            <tr><td style="padding:4px 0;color:#777;">Trieda:</td><td style="padding:4px 0;">${CLASS_LABEL[variant.class]} ${variant.vehicleCount > 1 ? `× ${variant.vehicleCount}` : ""}</td></tr>
            <tr><td style="padding:4px 0;color:#777;">Vzdialenosť:</td><td style="padding:4px 0;">${distance.km.toLocaleString("sk-SK")} km (${distance.source === "google" ? "Google Maps" : "odhad"})</td></tr>
            <tr><td style="padding:4px 0;color:#777;">Cena / vozidlo:</td><td style="padding:4px 0;">${formatEur(variant.pricePerVehicle)} €</td></tr>
            <tr><td style="padding:8px 0;color:#333;font-weight:700;">Celkom:</td><td style="padding:8px 0;color:#B88746;font-weight:700;font-size:18px;">${formatEur(variant.totalPrice)} €</td></tr>
          </table>
        </div>

        <h3 style="margin:24px 0 10px;color:#333;font-size:16px;">Trasa</h3>
        <p style="font-size:14px;color:#333;line-height:1.6;">${route}</p>
        <p style="font-size:13px;color:#777;">${escapeHtml(trip.date)} · ${escapeHtml(trip.time)} · ${trip.pax} pax${trip.isReturnTrip ? ` · spiatočná ${escapeHtml(trip.returnDate)} ${escapeHtml(trip.returnTime)}` : ""}</p>

        <h3 style="margin:24px 0 10px;color:#333;font-size:16px;">Objednávateľ</h3>
        <table style="width:100%;font-size:14px;color:#333;">
          <tr><td style="padding:4px 0;color:#777;width:140px;">Typ:</td><td>${trip.personType === "company" ? "Firma" : "Fyzická osoba"}</td></tr>
          ${trip.personType === "company" ? `<tr><td style="padding:4px 0;color:#777;">Spoločnosť:</td><td>${escapeHtml(customer.companyName)}</td></tr>` : ""}
          <tr><td style="padding:4px 0;color:#777;">Meno:</td><td>${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}</td></tr>
          <tr><td style="padding:4px 0;color:#777;">E-mail:</td><td><a href="mailto:${escapeHtml(customer.email)}" style="color:#B88746;text-decoration:none;">${escapeHtml(customer.email)}</a></td></tr>
          <tr><td style="padding:4px 0;color:#777;">Telefón:</td><td>${escapeHtml(customer.phone)}</td></tr>
          <tr><td style="padding:4px 0;color:#777;">Hl. pasažier:</td><td>${mp}</td></tr>
          ${customer.flightNumber ? `<tr><td style="padding:4px 0;color:#777;">Číslo letu:</td><td>${escapeHtml(customer.flightNumber)}</td></tr>` : ""}
          <tr><td style="padding:4px 0;color:#777;">Platba:</td><td>${PAYMENT_LABEL[customer.paymentMethod]}</td></tr>
          ${customer.orderReference ? `<tr><td style="padding:4px 0;color:#777;">Ref. objednávky:</td><td>${escapeHtml(customer.orderReference)}</td></tr>` : ""}
        </table>
        ${customer.notes ? `<h3 style="margin:24px 0 8px;color:#333;font-size:16px;">Poznámka</h3><p style="font-size:13px;color:#555;white-space:pre-wrap;">${escapeHtml(customer.notes)}</p>` : ""}

        <p style="margin:24px 0 0;font-size:11px;color:#999;">
          Marketing súhlas: ${body.consents.marketing ? "ÁNO" : "nie"}
        </p>
      </div>
    </div>
  `
}

function buildCustomerHtml(body: OrderBody, logoUrl: string): string {
  const { variant } = body
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background:#f5f5f5;">
      ${logoUrl ? `<div style="text-align:center;margin:0 0 14px;"><img src="${logoUrl}" alt="BY THE WAVE" width="120" height="40"/></div>` : ""}
      <div style="background:linear-gradient(135deg,#B88746 0%,#A67C52 100%);padding:28px 20px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;font-weight:bold;">Potvrdenie objednávky</h1>
      </div>
      <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
        <p style="font-size:15px;color:#333;">Dobrý deň, ${escapeHtml(body.customer.firstName)},</p>
        <p style="font-size:14px;color:#555;line-height:1.6;">
          ďakujeme za objednávku transferu. Nižšie nájdete jej súhrn. Potvrdenie
          detailov a číslo vodiča vám zašleme po overení v nasledujúcich 24 hodinách.
        </p>
        <div style="background:#f8f9fa;padding:16px;border-left:4px solid #B88746;border-radius:4px;margin:20px 0;">
          <strong style="color:#333;">${CLASS_LABEL[variant.class]}</strong>${variant.vehicleCount > 1 ? ` × ${variant.vehicleCount}` : ""}<br/>
          <span style="color:#B88746;font-size:22px;font-weight:bold;">${formatEur(variant.totalPrice)} €</span>
        </div>
        <p style="font-size:13px;color:#777;">
          V prípade zmien nás kontaktujte na
          <a href="tel:+421905102220" style="color:#B88746;text-decoration:none;">+421 905 102 220</a>
          alebo
          <a href="mailto:btw@btw.sk" style="color:#B88746;text-decoration:none;">btw@btw.sk</a>.
        </p>
        <p style="font-size:12px;color:#aaa;margin-top:20px;">S pozdravom,<br/>Tím BY THE WAVE</p>
      </div>
    </div>
  `
}

function validate(body: OrderBody): { ok: true } | { ok: false; error: string } {
  if (!body.trip?.pickup?.placeId || !body.trip?.destination?.placeId) {
    return { ok: false, error: "Neplatná trasa." }
  }
  if (!body.trip.date || !body.trip.time) {
    return { ok: false, error: "Chýba dátum alebo čas." }
  }
  if (!body.distance?.km || body.distance.km <= 0) {
    return { ok: false, error: "Chýba výpočet vzdialenosti." }
  }
  if (!body.variant || !body.variant.class) {
    return { ok: false, error: "Chýba výber vozidla." }
  }
  if (!body.customer?.email || !body.customer?.firstName || !body.customer?.lastName) {
    return { ok: false, error: "Chýbajú kontaktné údaje." }
  }
  if (!body.consents?.gdpr) {
    return { ok: false, error: "Chýba súhlas s GDPR." }
  }
  return { ok: true }
}

export async function POST(request: NextRequest) {
  let body: OrderBody
  try {
    body = (await request.json()) as OrderBody
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 })
  }

  // Honeypot: bots fill `website`
  if (body.website && body.website.trim().length > 0) {
    // Pretend success — don't tip off the bot
    return NextResponse.json({ success: true, message: "OK" })
  }

  const valid = validate(body)
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 })
  }

  // Anti-tamper: recompute price from trusted inputs
  const destIsAirport = isAirportPlace(body.trip.destination.placeId, body.trip.destination.types)
  const priceOk = verifyVariantPrice(
    {
      km: body.distance.km,
      pax: body.trip.pax,
      destIsAirport,
      isReturnTrip: body.trip.isReturnTrip,
      waypointCount: body.trip.waypoints?.length ?? 0,
      preferredClass: null,
    },
    {
      class: body.variant.class,
      vehicleCount: body.variant.vehicleCount,
      totalPrice: body.variant.totalPrice,
    },
  )
  if (!priceOk) {
    return NextResponse.json(
      { error: "Cena vypršala, prosím obnovte výpočet." },
      { status: 400 },
    )
  }

  const RESEND_KEY = process.env.RESEND_API_KEY
  if (!RESEND_KEY) {
    console.error("[api/order] RESEND_API_KEY not set — email not sent")
    return NextResponse.json({
      success: true,
      message: "Objednávka prijatá (dev mode, email nebol odoslaný).",
    })
  }

  const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ""
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const requestBaseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : ""
  const publicBaseUrl = envBaseUrl || requestBaseUrl
  const logoUrl = publicBaseUrl ? `${publicBaseUrl}/images/logo.svg` : ""

  const from = process.env.CONTACT_FROM_EMAIL || "BY THE WAVE <web@rezervacie.btw.sk>"
  const to = process.env.CONTACT_TO_EMAIL || "btw@btw.sk"
  const confirmFrom = process.env.CONFIRMATION_FROM_EMAIL || "potvrdenie@rezervacie.btw.sk"

  const adminSubject = `Objednávka · ${body.customer.firstName} ${body.customer.lastName} · ${formatEur(body.variant.totalPrice)} €`
  const adminRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: adminSubject,
      html: buildAdminHtml(body, logoUrl),
    }),
  })
  if (!adminRes.ok) {
    const errText = await adminRes.text().catch(() => "")
    console.error("[api/order] admin email failed", adminRes.status, errText)
    return NextResponse.json(
      { error: "Odoslanie zlyhalo. Skúste znova neskôr." },
      { status: 502 },
    )
  }

  // Customer confirmation — best effort, never blocks success
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: confirmFrom,
        to: [body.customer.email],
        subject: "Potvrdenie objednávky — BY THE WAVE",
        html: buildCustomerHtml(body, logoUrl),
      }),
    })
  } catch (err) {
    console.warn("[api/order] customer confirm email failed", err)
  }

  return NextResponse.json({
    success: true,
    message: "Objednávka odoslaná. Čoskoro vás kontaktujeme.",
  })
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed. Use POST /api/order." },
    { status: 405 },
  )
}
