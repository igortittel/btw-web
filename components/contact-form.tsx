"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface FormState {
  success?: boolean
  message?: string
  errors?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    subject?: string
    message?: string
    gdprConsent?: string
  }
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>({})
  const formRef = useRef<HTMLFormElement>(null)

  // Consents
  const [gdprConsent, setGdprConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)

  // Anti-spam: timestamp when the form was first rendered
  const [startedAt] = useState(() => Date.now())

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState({})

    const formData = new FormData(e.currentTarget)

    // Anti-spam: time-trap
    formData.set("startedAt", String(startedAt))

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const rawText = await response.text()
      let result: any = null
      try {
        result = rawText ? JSON.parse(rawText) : null
      } catch {
        result = null
      }

      if (!response.ok && !result) {
        throw new Error(`Request failed (${response.status})`)
      }

      if (result?.success) {
        setFormState({
          success: true,
          message: result?.message || "Ďakujeme! Správa bola prijatá. Ozveme sa vám čoskoro.",
        })
        // Reset form on success using ref
        if (formRef.current) {
          formRef.current.reset()
        }
        setGdprConsent(false)
        setMarketingConsent(false)
        // Note: startedAt intentionally stays as the initial render timestamp

        // Scroll to success message
        setTimeout(() => {
          const successElement = document.getElementById("form-message")
          if (successElement) {
            successElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 100)
      } else {
        setFormState({
          success: false,
          message: result?.message || "Nastala chyba pri odosielaní správy.",
          errors: result?.errors,
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormState({
        success: false,
        message: "Chyba pripojenia. Skontrolujte internetové pripojenie a skúste to znovu.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 md:py-24 px-6 bg-[#1D1D1D] text-center md:text-left">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-white text-center">KONTAKTUJTE NÁS</h2>
        <p className="text-[#CCCCCC] mb-12 md:mb-16 mx-auto md:mx-0 text-center md:text-left">
          Máte otázky alebo potrebujete ďalšie informácie? Vyplňte formulár nižšie a my sa vám ozveme čo najskôr.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Vaše meno*</label>
              <Input
                name="firstName"
                className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${
                  formState?.errors?.firstName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"
                }`}
                placeholder="Meno"
                required
                disabled={isSubmitting}
              />
              {formState?.errors?.firstName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formState.errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Vaše priezvisko*</label>
              <Input
                name="lastName"
                className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${
                  formState?.errors?.lastName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"
                }`}
                placeholder="Priezvisko"
                required
                disabled={isSubmitting}
              />
              {formState?.errors?.lastName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {formState.errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Váš e-mail*</label>
            <Input
              type="email"
              name="email"
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${
                formState?.errors?.email ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"
              }`}
              placeholder="E-Mail"
              required
              disabled={isSubmitting}
            />
            {formState?.errors?.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Telefón (voliteľné)</label>
            <Input
              type="tel"
              name="phone"
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${
                formState?.errors?.phone ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"
              }`}
              placeholder="Telefón"
              disabled={isSubmitting}
            />
            {formState?.errors?.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Predmet (voliteľné)</label>
            <Input
              name="subject"
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${
                formState?.errors?.subject ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"
              }`}
              placeholder="Predmet"
              disabled={isSubmitting}
            />
            {formState?.errors?.subject && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Vaša správa*</label>
            <Textarea
              name="message"
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] min-h-32 rounded-lg transition-colors ${
                formState?.errors?.message ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"
              }`}
              placeholder="Napíšte nám vašu správu..."
              required
              disabled={isSubmitting}
            />
            {formState?.errors?.message && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.message}
              </p>
            )}
          </div>

          {/* Honeypot - Antispam */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {/* GDPR Consent (required) */}
          <div className="flex flex-col gap-2">
            <input type="hidden" name="gdprConsent" value={gdprConsent ? "true" : "false"} />
            <div className="flex items-center gap-2">
              <input
                id="gdprConsent"
                type="checkbox"
                checked={gdprConsent}
                onChange={() => setGdprConsent(!gdprConsent)}
                disabled={isSubmitting}
                className="btw-checkbox"
              />
              <label htmlFor="gdprConsent" className="text-white select-none">
                Súhlasím so spracovaním osobných údajov podľa{" "}
                <a
                  href="/ochrana-osobnych-udajov"
                  style={{ color: "#B88746", textDecoration: "underline" }}
                >
                  zásad ochrany osobných údajov
                </a>
                .*
              </label>
            </div>
            {formState?.errors?.gdprConsent && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.gdprConsent}
              </p>
            )}
          </div>

          {/* Marketing Consent (optional) */}
          <div className="flex flex-col gap-2">
            <input type="hidden" name="marketingConsent" value={marketingConsent ? "true" : "false"} />
            <div className="flex items-center gap-2">
              <input
                id="marketingConsent"
                type="checkbox"
                checked={marketingConsent}
                onChange={() => setMarketingConsent(!marketingConsent)}
                disabled={isSubmitting}
                className="btw-checkbox"
              />
              <label htmlFor="marketingConsent" className="text-white select-none">
                Chcem dostávať výhodné ponuky, zľavy a akcie od By The Wave.
              </label>
            </div>
          </div>          

          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#B88746] hover:bg-[#A67C52] text-white px-10 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Odosielam...
                </>
              ) : (
                "Odoslať správu"
              )}
            </Button>
          </div>

          {/* Success/Error Messages */}
          {formState?.message && (
            <div
              id="form-message"
              className={`text-center p-6 rounded-lg border transition-all duration-300 ${
                formState.success
                  ? "bg-green-900/20 border-green-500 text-green-400"
                  : "bg-red-900/20 border-red-500 text-red-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {formState.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-medium">{formState.success ? "Úspešne odoslané!" : "Chyba pri odosielaní"}</span>
              </div>
              <p className="text-sm leading-relaxed">{formState.message}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
