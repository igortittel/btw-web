"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReservationForm } from "@/components/reservation-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Reveal } from "@/components/Reveal"

const SESSION_KEY = "test_form_unlocked"
const PASSWORD = "claude"

export default function TestFormPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setUnlocked(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true")
      setUnlocked(true)
    } else {
      setError(true)
      setPassword("")
    }
  }

  if (!mounted) return null

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-[#B88746] text-sm font-semibold tracking-widest uppercase text-center mb-2">
            Testovacia stránka
          </p>
          <h1 className="text-2xl font-bold text-white text-center mb-8">Zadaj heslo</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              placeholder="Heslo"
              autoFocus
              className="w-full bg-[#111111] border border-white/20 text-white rounded-md px-4 py-3 text-sm outline-none focus:border-[#B88746] transition-colors"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">Nesprávne heslo</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#B88746] hover:bg-[#a07535] text-black font-semibold py-3 rounded-md transition-colors text-sm tracking-wide"
            >
              Vstúpiť
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Test banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#B88746] text-black text-xs font-semibold text-center py-1 tracking-wide">
        TESTOVACIA VERZIA FORMULÁRA
      </div>

      <section className="py-4 px-6 pt-36 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal y={16} delay={0.02}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
                Rezervačný formulár
                <span className="block text-[#B88746]">na prepravu osôb</span>
              </h1>
            </Reveal>
            <Reveal y={16} delay={0.08}>
              <p className="text-[#CCCCCC] mt-6 leading-relaxed max-w-3xl mx-auto">
                Vyplňte krátky nezáväzný formulár a na základe poskytnutých informácií vás budeme kontaktovať s individuálnou cenovou ponukou.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal y={12} delay={0.12}>
        <div className="max-w-6xl mx-auto px-6" aria-hidden="true">
          <div className="h-px w-full bg-white/10" />
        </div>
      </Reveal>

      <ReservationForm />

      <Footer />
    </div>
  )
}
