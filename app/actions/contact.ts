"use server"

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  message: string
}

interface ContactFormState {
  success?: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    message?: string
  }
}

export async function submitContactForm(
  prevState: ContactFormState | undefined,
  formData: FormData,
): Promise<ContactFormState> {
  // Extract form data
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // Validation
  const errors: ContactFormState["errors"] = {}

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
    return {
      success: false,
      errors,
      message: "Prosím opravte chyby vo formulári",
    }
  }

  try {
    // Send email using fetch to a service like Resend or direct SMTP
    const emailData = {
      to: "michal@antal.dev",
      from: "noreply@bythewave.sk",
      subject: `Nová správa z kontaktného formulára - ${firstName} ${lastName}`,
      html: `
        <h2>Nová správa z kontaktného formulára</h2>
        <p><strong>Meno:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Správa:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Odoslané z BY THE WAVE - Executive Mobility</small></p>
      `,
      text: `
        Nová správa z kontaktného formulára
        
        Meno: ${firstName} ${lastName}
        Email: ${email}
        
        Správa:
        ${message}
        
        ---
        Odoslané z BY THE WAVE - Executive Mobility
      `,
    }

    // Using Resend API (you would need to add RESEND_API_KEY to environment variables)
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return {
      success: true,
      message: "Ďakujeme za vašu správu! Ozveme sa vám čo najskôr.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Nastala chyba pri odosielaní správy. Skúste to prosím znovu.",
    }
  }
}
