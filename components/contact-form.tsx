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
    message?: string
  }
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>({})
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState({})

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setFormState({
          success: true,
          message: result.message,
        })
        // Reset form on success using ref
        if (formRef.current) {
          formRef.current.reset()
        }

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
          message: result.message || "Nastala chyba pri odosielaní správy.",
          errors: result.errors,
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
