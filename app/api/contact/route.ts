import { type NextRequest, NextResponse } from "next/server"

interface ContactFormResponse {
  success: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    message?: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactFormResponse>> {
  try {
    const formData = await request.formData()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    // Validation
    const errors: ContactFormResponse["errors"] = {}

    if (!firstName || firstName.trim().length < 2) {
      errors.firstName = "Meno musí mať aspoň 2 znaky"
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.lastName = "Priezvisko musí mať aspoň 2 znaky"
    }

    if (!email || !email.includes("@")) {
      errors.email = "Zadajte platný email"
    }

    if (!message || message.trim().length < 10) {
      errors.message = "Správa musí mať aspoň 10 znakov"
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({
        success: false,
        errors,
        message: "Prosím opravte chyby vo formulári",
      })
    }

    // Get API key from environment
    const apiKey = process.env.RESEND_API_KEY

    // Verify API key exists and is valid format
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY is not set in environment variables")
      return NextResponse.json({
        success: false,
        message: "Konfiguračná chyba servera. Kontaktujte administrátora.",
      })
    }

    if (!apiKey.startsWith("re_")) {
      console.error("❌ RESEND_API_KEY has invalid format:", apiKey.substring(0, 10) + "...")
      return NextResponse.json({
        success: false,
        message: "Konfiguračná chyba servera. Kontaktujte administrátora.",
      })
    }

    // Log form submission attempt
    console.log("📧 Attempting to send email...")
    console.log(`👤 From: ${firstName} ${lastName} (${email})`)
    console.log(`📅 Time: ${new Date().toLocaleString("sk-SK")}`)

    try {
      // Prepare email data - using the new recipient email
      const emailData = {
        from: "BY THE WAVE <onboarding@resend.dev>",
        to: ["XXXXXXXXXXX"], // Updated to new email
        subject: `Nová správa z kontaktného formulára - ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #B88746 0%, #A67C52 100%); padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">BY THE WAVE</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; letter-spacing: 1px;">Executive Mobility</p>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 25px 0; font-size: 24px;">Nová správa z kontaktného formulára</h2>
              
              <!-- Contact Info Card -->
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #B88746;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555; width: 120px; vertical-align: top;">Meno:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555; vertical-align: top;">Email:</td>
                    <td style="padding: 10px 0;">
                      <a href="mailto:${email}" style="color: #B88746; text-decoration: none; font-weight: 500; font-size: 16px;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: 600; color: #555; vertical-align: top;">Čas odoslania:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${new Date().toLocaleString("sk-SK", {
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
              
              <!-- Message -->
              <div style="margin: 30px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Správa:</h3>
                <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 5px solid #B88746; line-height: 1.7; font-size: 16px; color: #444;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>
              
              <!-- Reply Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="mailto:${email}?subject=Re: Vaša správa pre BY THE WAVE" 
                   style="background: linear-gradient(135deg, #B88746 0%, #A67C52 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Odpovedať na email
                </a>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.5;">
                  Táto správa bola odoslaná z kontaktného formulára na<br>
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
Nová správa z kontaktného formulára

═══════════════════════════════════════

Kontaktné údaje:
• Meno: ${firstName} ${lastName}
• Email: ${email}
• Čas: ${new Date().toLocaleString("sk-SK")}

Správa:
${message}

═══════════════════════════════════════

Pre odpoveď napíšte na: ${email}

Táto správa bola odoslaná z kontaktného formulára na bythewave.sk
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
        console.log("✅ Email successfully sent!")
        console.log(`📧 Email ID: ${result.id}`)
        console.log("=".repeat(50))

        return NextResponse.json({
          success: true,
          message: "Ďakujeme za vašu správu! Email bol úspešne odoslaný a ozveme sa vám čo najskôr.",
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
        let userMessage = "Nastala chyba pri odosielaní emailu."

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

        return NextResponse.json({
          success: false,
          message: userMessage,
        })
      }
    } catch (fetchError) {
      console.error("❌ Network/Fetch Error:", fetchError)

      return NextResponse.json({
        success: false,
        message: "Chyba pripojenia k emailovej službe. Skontrolujte internetové pripojenie a skúste to znovu.",
      })
    }
  } catch (error) {
    console.error("❌ Unexpected error in contact form:", error)

    return NextResponse.json({
      success: false,
      message: "Nastala neočakávaná chyba. Skúste to prosím znovu alebo nás kontaktujte priamo.",
    })
  }
}
