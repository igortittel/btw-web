import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Always return JSON even when the client calls the endpoint with the wrong method.
export async function GET(): Promise<NextResponse<{ success: false; message: string }>> {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed. Use POST /api/reservation." },
    { status: 405 },
  )
}

export async function OPTIONS(): Promise<NextResponse<null>> {
  return new NextResponse(null, { status: 204 })
}

interface ReservationFormResponse {
  success: boolean
  message?: string
  errors?: {
    personType?: string
    firstName?: string
    lastName?: string
    companyName?: string
    email?: string
    phone?: string
    pickupAddress?: string
    destinationAddress?: string
    date?: string
    time?: string
    passengers?: string
    vehicleCategory?: string
    sameAsMainPassenger?: string
    mainPassengerFirstName?: string
    mainPassengerLastName?: string
    paymentMethod?: string
    notes?: string
    gdprConsent?: string
    marketingConsent?: string
    returnPickupAddress?: string
    returnDestinationAddress?: string
    returnDate?: string
    returnTime?: string
    returnPassengers?: string
    returnVehicleCategory?: string
    returnPassengerFirstName?: string
    returnPassengerLastName?: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ReservationFormResponse>> {
  const escapeHtml = (input: string) =>
    input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;")

  try {
    const contentType = request.headers.get("content-type") || ""

    // Accept both JSON and FormData payloads.
    const payload: Record<string, any> = {}

    if (contentType.includes("application/json")) {
      Object.assign(payload, await request.json())
    } else {
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        // FormData values can be string or File; we only expect strings.
        payload[key] = typeof value === "string" ? value : ""
      }
    }

    // Anti-spam: honeypot field (should stay empty for real users)
    const honeypot = String(payload["website"] || "").trim()
    if (honeypot) {
      // Pretend success so bots get no feedback
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Extract form data
    const personTypeRaw = (payload["personType"] as string) || "individual"
    const personType = personTypeRaw === "company" ? "company" : "individual"

    const firstName = (payload["firstName"] as string) || ""
    const lastName = (payload["lastName"] as string) || ""
    const companyName = (payload["companyName"] as string) || ""
    const email = (payload["email"] as string) || ""
    const phone = (payload["phone"] as string) || ""

    const pickupAddress = (payload["pickupAddress"] as string) || ""
    const destinationAddress = (payload["destinationAddress"] as string) || ""
    const date = (payload["date"] as string) || ""
    const time = (payload["time"] as string) || ""
    const passengersRaw = (payload["passengers"] as string) || ""
    const returnTrip = (((payload["returnTrip"] as string) || "false") === "true")

    const vehicleCategory = (payload["vehicleCategory"] as string) || ""

    const sameAsMainPassengerRaw = (payload["sameAsMainPassenger"] as string) || "true"
    const sameAsMainPassenger = sameAsMainPassengerRaw !== "false"
    const mainPassengerFirstName = (payload["mainPassengerFirstName"] as string) || ""
    const mainPassengerLastName = (payload["mainPassengerLastName"] as string) || ""

    const flightNumber = (payload["flightNumber"] as string) || ""
    const paymentMethod = (payload["paymentMethod"] as string) || ""

    const returnPickupAddress = (payload["returnPickupAddress"] as string) || ""
    const returnDestinationAddress = (payload["returnDestinationAddress"] as string) || ""
    const returnDate = (payload["returnDate"] as string) || ""
    const returnTime = (payload["returnTime"] as string) || ""
    const returnPassengersRaw = (payload["returnPassengers"] as string) || ""
    const returnVehicleCategory = (payload["returnVehicleCategory"] as string) || ""
    const returnFlightNumber = (payload["returnFlightNumber"] as string) || ""
    const returnSamePassengerRaw = (payload["returnSamePassenger"] as string) || "true"
    const returnSamePassenger = returnSamePassengerRaw !== "false"
    const returnPassengerFirstName = (payload["returnPassengerFirstName"] as string) || ""
    const returnPassengerLastName = (payload["returnPassengerLastName"] as string) || ""

    const notes = (payload["notes"] as string) || ""
    const gdprConsent = (((payload["gdprConsent"] as string) || "false") === "true")
    const marketingConsent = (((payload["marketingConsent"] as string) || "false") === "true")

    // Validation
    const errors: ReservationFormResponse["errors"] = {}

    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = "Meno musí mať aspoň 2 znaky"
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = "Priezvisko musí mať aspoň 2 znaky"
    }

    if (personType === "company" && (!companyName || companyName.trim().length < 2)) {
      errors.companyName = "Názov firmy musí mať aspoň 2 znaky"
    }

    if (!email || !email.includes("@")) {
      errors.email = "Zadajte platný email"
    }

    if (!phone || phone.trim().length < 6) {
      errors.phone = "Telefónne číslo musí mať aspoň 6 znakov"
    }

    if (!pickupAddress || pickupAddress.trim().length < 5) {
      errors.pickupAddress = "Vyzdvihnutie musí mať aspoň 5 znakov"
    }

    if (!destinationAddress || destinationAddress.trim().length < 5) {
      errors.destinationAddress = "Cieľ musí mať aspoň 5 znakov"
    }

    if (!date) {
      errors.date = "Dátum je povinný"
    }

    if (!time) {
      errors.time = "Čas je povinný"
    }

    const passengers = parseInt(passengersRaw, 10)
    if (isNaN(passengers) || passengers < 1 || passengers > 20) {
      errors.passengers = "Počet pasažierov musí byť číslo od 1 do 20"
    }

    const validVehicleCategories = ["Business Van", "Business Class", "First Class", "Nezáleží"]
    if (!validVehicleCategories.includes(vehicleCategory)) {
      errors.vehicleCategory = "Vyberte platnú kategóriu vozidla"
    }

    const validPaymentMethods = ["Faktúra", "Hotovosť na mieste", "Platobnou kartou"]
    if (!validPaymentMethods.includes(paymentMethod)) {
      errors.paymentMethod = "Vyberte platný spôsob platby"
    }

    if (!sameAsMainPassenger) {
      if (!mainPassengerFirstName || mainPassengerFirstName.trim().length < 2) {
        errors.mainPassengerFirstName = "Meno hlavného pasažiera musí mať aspoň 2 znaky"
      }
      if (!mainPassengerLastName || mainPassengerLastName.trim().length < 2) {
        errors.mainPassengerLastName = "Priezvisko hlavného pasažiera musí mať aspoň 2 znaky"
      }
    }

    if (returnTrip) {
      if (!returnPickupAddress || returnPickupAddress.trim().length < 5) {
        errors.returnPickupAddress = "Adresa vyzdvihnutia spiatočnej cesty je povinná"
      }
      if (!returnDestinationAddress || returnDestinationAddress.trim().length < 5) {
        errors.returnDestinationAddress = "Cieľová adresa spiatočnej cesty je povinná"
      }
      if (!returnDate) {
        errors.returnDate = "Dátum spiatočnej cesty je povinný"
      }
      if (!returnTime) {
        errors.returnTime = "Čas spiatočnej cesty je povinný"
      }
      const returnPassengers = parseInt(returnPassengersRaw, 10)
      if (isNaN(returnPassengers) || returnPassengers < 1 || returnPassengers > 20) {
        errors.returnPassengers = "Počet pasažierov musí byť číslo od 1 do 20"
      }
      if (!validVehicleCategories.includes(returnVehicleCategory)) {
        errors.returnVehicleCategory = "Vyberte platnú kategóriu vozidla pre spiatočnú cestu"
      }
      if (!returnSamePassenger) {
        if (!returnPassengerFirstName || returnPassengerFirstName.trim().length < 2) {
          errors.returnPassengerFirstName = "Meno hlavného pasažiera musí mať aspoň 2 znaky"
        }
        if (!returnPassengerLastName || returnPassengerLastName.trim().length < 2) {
          errors.returnPassengerLastName = "Priezvisko hlavného pasažiera musí mať aspoň 2 znaky"
        }
      }
    }

    if (!gdprConsent) {
      errors.gdprConsent = "Súhlas so spracovaním osobných údajov je povinný."
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: "Prosím opravte chyby vo formulári",
        },
        { status: 400 },
      )
    }

    // Get API key from environment
    const apiKey = process.env.RESEND_API_KEY

    // Verify API key exists and is valid format
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY is not set in environment variables")
      return NextResponse.json(
        {
          success: false,
          message: "Konfiguračná chyba servera. Kontaktujte administrátora.",
        },
        { status: 500 },
      )
    }

    if (!apiKey.startsWith("re_")) {
      console.error("❌ RESEND_API_KEY has invalid format:", apiKey.substring(0, 10) + "...")
      return NextResponse.json(
        {
          success: false,
          message: "Konfiguračná chyba servera. Kontaktujte administrátora.",
        },
        { status: 500 },
      )
    }

    // Log form submission attempt
    console.log("📧 Attempting to send reservation email...")
    console.log(`👤 Reservation from: ${firstName} ${lastName} (${email})`)
    console.log(`📅 Reservation time: ${new Date().toLocaleString("sk-SK")}`)

    try {
      // Prepare base URL for logo (must be absolute for email clients)
      const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ""
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
      const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
      const requestBaseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : ""
      const publicBaseUrl = envBaseUrl || requestBaseUrl
      const logoUrl = publicBaseUrl ? `${publicBaseUrl}/images/logo.svg` : ""
      // Prepare email data - using the new recipient email
      const emailData = {
        from: process.env.CONTACT_FROM_EMAIL || "BY THE WAVE <web@rezervacie.btw.sk>",
        to: [process.env.CONTACT_TO_EMAIL || "btw@btw.sk"],
        subject: `Nová web rezervácia - ${firstName} ${lastName} (${date} ${time})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            ${logoUrl ? `<div style="text-align:center; margin: 0 0 14px 0;">
              <img src="${logoUrl}" alt="BY THE WAVE" width="120" height="40" style="display:inline-block; max-width:120px; height:auto;" />
            </div>` : ""}
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #B88746 0%, #A67C52 100%); padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">BY THE WAVE</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; letter-spacing: 1px;">Executive Mobility</p>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 25px 0; font-size: 24px;">Nová rezervácia</h2>
              
              <!-- Reservation Info Card -->
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #B88746;">
                <table style="width: 100%; border-collapse: collapse; font-size: 16px; color: #333;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555; width: 180px; vertical-align: top;">Typ:</td>
                    <td style="padding: 10px 0;">${personType === "company" ? "Firma" : "Fyzická osoba"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Meno:</td>
                    <td style="padding: 10px 0;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td>
                  </tr>
                  ${
                    personType === "company"
                      ? `<tr>
                          <td style="padding: 10px 0; font-weight: 600; color: #555;">Firma:</td>
                          <td style="padding: 10px 0;">${escapeHtml(companyName)}</td>
                        </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Email:</td>
                    <td style="padding: 10px 0;">
                      <a href="mailto:${escapeHtml(email)}" style="color: #B88746; text-decoration: none; font-weight: 500;">${escapeHtml(email)}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Telefón:</td>
                    <td style="padding: 10px 0;">${escapeHtml(phone)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Vyzdvihnutie:</td>
                    <td style="padding: 10px 0;">${escapeHtml(pickupAddress)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Cieľ:</td>
                    <td style="padding: 10px 0;">${escapeHtml(destinationAddress)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Dátum a čas:</td>
                    <td style="padding: 10px 0;">${escapeHtml(date)} ${escapeHtml(time)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Pasažieri:</td>
                    <td style="padding: 10px 0;">${passengers}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Spiatočná cesta:</td>
                    <td style="padding: 10px 0;">${returnTrip ? "Áno" : "Nie"}</td>
                  </tr>
                  ${returnTrip ? `
                  <tr>
                    <td colspan="2" style="padding: 12px 0 4px 0; font-weight: 700; color: #B88746; font-size: 13px; letter-spacing: 0.05em; border-top: 1px solid #eee;">SPIATOČNÁ CESTA</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555; width: 180px; vertical-align: top;">Vyzdvihnutie (sp.):</td>
                    <td style="padding: 10px 0;">${escapeHtml(returnPickupAddress)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Cieľ (sp.):</td>
                    <td style="padding: 10px 0;">${escapeHtml(returnDestinationAddress)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Dátum a čas (sp.):</td>
                    <td style="padding: 10px 0;">${escapeHtml(returnDate)} ${escapeHtml(returnTime)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Pasažieri (sp.):</td>
                    <td style="padding: 10px 0;">${parseInt(returnPassengersRaw, 10) || returnPassengersRaw}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Kategória (sp.):</td>
                    <td style="padding: 10px 0;">${escapeHtml(returnVehicleCategory)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Pasažier (sp.):</td>
                    <td style="padding: 10px 0;">${returnSamePassenger ? "Zhodný s objednávateľom" : escapeHtml(returnPassengerFirstName) + " " + escapeHtml(returnPassengerLastName)}</td>
                  </tr>
                  ${returnFlightNumber ? `<tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Let (sp.):</td>
                    <td style="padding: 10px 0;">${escapeHtml(returnFlightNumber)}</td>
                  </tr>` : ""}
                  ` : ""}
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Kategória vozidla:</td>
                    <td style="padding: 10px 0;">${escapeHtml(vehicleCategory)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Hlavný pasažier:</td>
                    <td style="padding: 10px 0;">${
                      sameAsMainPassenger
                        ? "Zhodný s objednávateľom"
                        : escapeHtml(mainPassengerFirstName) + " " + escapeHtml(mainPassengerLastName)
                    }</td>
                  </tr>
                  ${
                    flightNumber
                      ? `<tr>
                          <td style="padding: 10px 0; font-weight: 600; color: #555;">Číslo letu:</td>
                          <td style="padding: 10px 0;">${escapeHtml(flightNumber)}</td>
                        </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Spôsob platby:</td>
                    <td style="padding: 10px 0;">${escapeHtml(paymentMethod)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Marketingový súhlas:</td>
                    <td style="padding: 10px 0;">${marketingConsent ? "Áno" : "Nie"}</td>
                  </tr>
                  ${
                    notes
                      ? `<tr>
                          <td style="padding: 10px 0; font-weight: 600; color: #555;">Poznámky:</td>
                          <td style="padding: 10px 0;">${escapeHtml(notes)}</td>
                        </tr>`
                      : ""
                  }
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555;">Čas odoslania:</td>
                    <td style="padding: 10px 0;">${new Date().toLocaleString("sk-SK", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Reply Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="mailto:${escapeHtml(email)}?subject=Re: Vaša rezervácia pre BY THE WAVE" 
                   style="background: linear-gradient(135deg, #B88746 0%, #A67C52 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Odpovedať na email
                </a>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.5;">
                  Táto správa bola odoslaná z rezervačného formulára na<br>
                  <strong style="color: #B88746;">bythewave.sk</strong> - Executive Mobility
                </p>
                <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                  ${new Date().toISOString()}
                </p>
              </div>
            </div>
          </div>
        `,
        text: `
BY THE WAVE - Executive Mobility
Nová rezervácia

═══════════════════════════════════════

Typ: ${personType === "company" ? "Firma" : "Fyzická osoba"}
Meno: ${firstName} ${lastName}
${personType === "company" ? `Firma: ${companyName}` : ""}
Email: ${email}
Telefón: ${phone}
Vyzdvihnutie: ${pickupAddress}
Cieľ: ${destinationAddress}
Dátum a čas: ${date} ${time}
Pasažieri: ${passengers}
Spiatočná cesta: ${returnTrip ? "Áno" : "Nie"}
${returnTrip ? `
─── SPIATOČNÁ CESTA ───
Vyzdvihnutie (sp.): ${returnPickupAddress}
Cieľ (sp.): ${returnDestinationAddress}
Dátum a čas (sp.): ${returnDate} ${returnTime}
Pasažieri (sp.): ${returnPassengersRaw}
Kategória (sp.): ${returnVehicleCategory}
Pasažier (sp.): ${returnSamePassenger ? "Zhodný s objednávateľom" : returnPassengerFirstName + " " + returnPassengerLastName}
${returnFlightNumber ? `Let (sp.): ${returnFlightNumber}` : ""}` : ""}
Kategória vozidla: ${vehicleCategory}
Hlavný pasažier: ${
          sameAsMainPassenger
            ? "Zhodný s objednávateľom"
            : mainPassengerFirstName + " " + mainPassengerLastName
        }
${flightNumber ? `Číslo letu: ${flightNumber}` : ""}
Spôsob platby: ${paymentMethod}
Marketingový súhlas: ${marketingConsent ? "Áno" : "Nie"}
${notes ? `Poznámky: ${notes}` : ""}

═══════════════════════════════════════

Pre odpoveď napíšte na: ${email}

Táto správa bola odoslaná z rezervačného formulára na bythewave.sk
        `,
      }

      // Send email via Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      // Handle response
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Reservation email successfully sent!")
        console.log(`📧 Email ID: ${result.id}`)
        console.log("=".repeat(50))

        // Send customer confirmation email (best-effort: do not fail the reservation if this email fails)
        try {
          const confirmationFrom = process.env.CONFIRMATION_FROM_EMAIL || "BY THE WAVE <potvrdenie@rezervacie.btw.sk>"
          const confirmationTo = email

          const confirmationEmailData = {
            from: confirmationFrom,
            to: [confirmationTo],
            subject: "Potvrdenie prijatia dopytu",
            html: `
              <div style="font-family: Arial, sans-serif; background:#0b0b0b; padding: 24px 12px;">
                <div style="max-width: 640px; margin: 0 auto;">

                  <div style="text-align:center; margin: 0 0 14px 0;">
                    ${logoUrl ? `<img src="${logoUrl}" alt="BY THE WAVE" width="140" height="46" style="display:inline-block; max-width:140px; height:auto;" />` : ""}
                  </div>

                  <div style="background: linear-gradient(135deg, #B88746 0%, #A67C52 100%); padding: 22px 18px; border-radius: 14px 14px 0 0; text-align: center;">
                    <div style="color: rgba(255,255,255,0.92); font-size: 14px; letter-spacing: 1px;">Executive Mobility</div>
                    <div style="color: #fff; margin-top: 8px; font-size: 22px; font-weight: 700;">Potvrdenie prijatia dopytu</div>
                  </div>

                  <div style="background: #141414; border: 1px solid #222; padding: 22px 20px; border-radius: 0 0 14px 14px; box-shadow: 0 10px 20px rgba(0,0,0,0.35);">
                    <p style="margin: 0 0 12px 0; color: #e9e9e9; font-size: 16px; line-height: 1.7;">Dobrý deň, p. <strong style=\"color:#fff;\">${escapeHtml(lastName)}</strong>,</p>

                    <p style="margin: 0 0 14px 0; color: #e9e9e9; font-size: 16px; line-height: 1.7;">ďakujeme za prejavenú dôveru. Váš dopyt na transfer sme úspešne prijali.</p>

                    <div style="margin: 18px 0; padding: 16px; border-radius: 12px; background: #0f0f0f; border: 1px solid #242424;">
                      <div style="color:#B88746; font-weight:700; font-size: 14px; letter-spacing: .6px; margin-bottom: 10px;">INFORMÁCIE O DOPYTE</div>
                      <table style="width:100%; border-collapse: collapse; font-size: 14px; color:#e9e9e9;">
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd; width: 190px;">Vyzdvihnutie</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(pickupAddress)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Cieľ</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(destinationAddress)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Dátum a čas</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(date)} ${escapeHtml(time)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Počet pasažierov</td>
                          <td style="padding:8px 0; color:#fff;">${passengers}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Spiatočná cesta</td>
                          <td style="padding:8px 0; color:#fff;">${returnTrip ? "Áno" : "Nie"}</td>
                        </tr>
                        ${returnTrip ? `
                        <tr>
                          <td colspan="2" style="padding: 10px 0 2px 0; color:#B88746; font-size:12px; font-weight:700; letter-spacing:0.08em; border-top:1px solid #2a2a2a;">SPIATOČNÁ CESTA</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Vyzdvihnutie (sp.)</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(returnPickupAddress)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Cieľ (sp.)</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(returnDestinationAddress)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Dátum a čas (sp.)</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(returnDate)} ${escapeHtml(returnTime)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Počet pasažierov (sp.)</td>
                          <td style="padding:8px 0; color:#fff;">${returnPassengersRaw}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Kategória (sp.)</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(returnVehicleCategory)}</td>
                        </tr>
                        ${returnFlightNumber ? `<tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Let (sp.)</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(returnFlightNumber)}</td>
                        </tr>` : ""}
                        ` : ""}
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Kategória vozidla</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(vehicleCategory)}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd;">Spôsob platby</td>
                          <td style="padding:8px 0; color:#fff;">${escapeHtml(paymentMethod)}</td>
                        </tr>
                        ${notes ? `
                        <tr>
                          <td style="padding:8px 0; color:#bdbdbd; vertical-align: top;">Poznámky</td>
                          <td style="padding:8px 0; color:#fff; white-space: pre-wrap;">${escapeHtml(notes)}</td>
                        </tr>
                        ` : ``}
                      </table>
                    </div>

                    <p style="margin: 0 0 14px 0; color: #e9e9e9; font-size: 16px; line-height: 1.7;">Čoskoro Vás budeme kontaktovať na uvedenom tel. čísle <strong style=\"color:#fff;\">${escapeHtml(phone)}</strong>.</p>

                    <p style="margin: 0 0 14px 0; color: #e9e9e9; font-size: 16px; line-height: 1.7;">V prípade akýchkoľvek otázok nás neváhajte kontaktovať prostredníctvom kontaktov uverejnených na našej webstránke v sekcii Kontakty.</p>

                    <div style="margin-top: 18px; color:#e9e9e9; font-size: 16px; line-height: 1.7;">S pozdravom,<br><strong style=\"color:#fff;\">BY THE WAVE</strong></div>

                    <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #2a2a2a; color: #9a9a9a; font-size: 12px; text-align: center;">
                      Tento email bol odoslaný automaticky. Prosím, neodpovedajte naň.
                    </div>
                  </div>

                </div>
              </div>
            `,
            text:
              `Dobrý deň, p. ${lastName},\n\n` +
              `ďakujeme za prejavenú dôveru. Váš dopyt na transfer sme úspešne prijali.\n\n` +
              `Informácie o dopyte:\n` +
              `Vyzdvihnutie: ${pickupAddress}\n` +
              `Cieľ: ${destinationAddress}\n` +
              `Dátum a čas: ${date} ${time}\n` +
              `Počet pasažierov: ${passengers}\n` +
              `Spiatočná cesta: ${returnTrip ? "Áno" : "Nie"}\n` +
              (returnTrip ? (
                `\n─── Spiatočná cesta ───\n` +
                `Vyzdvihnutie: ${returnPickupAddress}\n` +
                `Cieľ: ${returnDestinationAddress}\n` +
                `Dátum a čas: ${returnDate} ${returnTime}\n` +
                `Počet pasažierov: ${returnPassengersRaw}\n` +
                `Kategória vozidla: ${returnVehicleCategory}\n` +
                (returnFlightNumber ? `Číslo letu: ${returnFlightNumber}\n` : "") +
                `───────────────────────\n\n`
              ) : "") +
              `Kategória vozidla: ${vehicleCategory}\n` +
              `Spôsob platby: ${paymentMethod}\n` +
              `${notes ? `Poznámky: ${notes}\n` : ""}` +
              `\nČoskoro Vás budeme kontaktovať na uvedenom tel. čísle ${phone}.\n\n` +
              `V prípade akýchkoľvek otázok nás neváhajte kontaktovať prostredníctvom kontaktov uverejnených na našej webstránke v sekcii Kontakty.\n\n` +
              `S pozdravom\nBY THE WAVE`,
          }

          const confirmationResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(confirmationEmailData),
          })

          if (confirmationResponse.ok) {
            const confirmationResult = await confirmationResponse.json()
            console.log("✅ Confirmation email sent", confirmationResult?.id)
          } else {
            const confirmationError = await confirmationResponse.text()
            console.warn("⚠️ Confirmation email failed", confirmationResponse.status, confirmationError)
          }
        } catch (confirmationError) {
          console.warn("⚠️ Confirmation email unexpected error", confirmationError)
        }

        return NextResponse.json({
          success: true,
          message:
            "Ďakujeme! Vaša rezervácia bola odoslaná. Čoskoro vás budeme kontaktovať s potvrdením a cenovou ponukou.",
        })
      } else {
        // Handle API errors
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        console.error("❌ Resend API Error:")
        console.error(`Status: ${response.status} ${response.statusText}`)
        console.error("Response:", errorData)

        // Provide specific error messages
        let userMessage = "Nastala chyba pri odosielaní rezervácie."

        if (response.status === 401) {
          userMessage = "Chyba autentifikácie emailovej služby. Kontaktujte administrátora."
          console.error("🔑 API Key issue - check if key is valid and has correct permissions")
        } else if (response.status === 403) {
          userMessage = "Emailová služba je v testovacom režime. Kontaktujte administrátora."
          console.error("🔒 Domain verification needed - check Resend dashboard")
        } else if (response.status === 422) {
          userMessage = "Neplatné údaje v emaili. Skúste to prosím znovu."
          console.error("📝 Validation error - check email format and content")
        } else if (response.status === 429) {
          userMessage = "Príliš veľa požiadaviek. Skúste to prosím za chvíľu."
          console.error("⏰ Rate limit exceeded")
        } else if (response.status >= 500) {
          userMessage = "Dočasná chyba emailovej služby. Skúste to prosím za chvíľu."
          console.error("🔧 Server error on Resend side")
        }

        return NextResponse.json(
          {
            success: false,
            message: userMessage,
          },
          { status: response.status },
        )
      }
    } catch (fetchError) {
      console.error("❌ Network/Fetch Error:", fetchError)

      return NextResponse.json(
        {
          success: false,
          message:
            "Chyba pripojenia k emailovej službe. Skontrolujte internetové pripojenie a skúste to znovu.",
        },
        { status: 502 },
      )
    }
  } catch (error) {
    console.error("❌ Unexpected error in reservation form:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Nastala neočakávaná chyba. Skúste to prosím znovu alebo nás kontaktujte priamo.",
      },
      { status: 500 },
    )
  }
}
