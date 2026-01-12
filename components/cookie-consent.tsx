"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ConsentState,
  applyConsentToGtag,
  defaultConsentState,
  readConsent,
  writeConsent,
  ensureGtagShim,
  toGtagConsent,
} from "@/lib/consent"

type Mode = "banner" | "settings"

const baseCard =
  "rounded-2xl border border-[#333333] bg-[#1D1D1D] text-white shadow-[0_20px_60px_rgba(0,0,0,0.55)]"

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState<Mode | null>(null)
  const [draft, setDraft] = useState<ConsentState>(defaultConsentState)

  // helper: accept / reject / save
  const acceptAll = () => {
    const next: ConsentState = { ...defaultConsentState, functional: true, analytics: true, marketing: true }
    persist(next)
  }

  const rejectAll = () => {
    const next: ConsentState = { ...defaultConsentState, functional: false, analytics: false, marketing: false }
    persist(next)
  }

  const persist = (state: ConsentState) => {
    writeConsent(state)
    applyConsentToGtag(state)
    setDraft(state)
    setOpen(null)
  }

  useEffect(() => {
    setMounted(true)

    // Consent Mode v2 (advanced): define defaults BEFORE tags load
    // We set defaults to denied (except security_storage granted)
    ensureGtagShim()
    window.gtag!("consent", "default", {
      ...toGtagConsent(defaultConsentState),
      wait_for_update: 500, // gives the banner time to update before tags fire
    })

    const existing = readConsent()
    if (existing) {
      setDraft(existing)
      applyConsentToGtag(existing)
      setOpen(null)
    } else {
      // No decision yet -> show banner
      setDraft(defaultConsentState)
      setOpen("banner")
    }

    // Expose a global opener (for footer link etc.)
    window.BTW_openCookieSettings = () => setOpen("settings")
  }, [])

  const title = useMemo(() => "Cookies", [])
  if (!mounted) return null

  // Banner UI (bottom)
  const Banner = () => (
    <div className="fixed inset-x-0 bottom-0 z-[99999] p-4 md:p-6">
      <div className={`mx-auto max-w-3xl ${baseCard}`}>
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="text-lg font-semibold" style={{ color: "#B88746" }}>
                {title}
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Používame cookies, aby web fungoval spoľahlivo (necessary), a voliteľne aj na vylepšenie služby (functional),
                meranie návštevnosti (analytics) a marketing (marketing). Vyber si, s čím súhlasíš.
              </p>
              <button
                type="button"
                className="text-sm underline underline-offset-4 text-white/80 hover:text-white"
                onClick={() => setOpen("settings")}
              >
                Upraviť nastavenia
              </button>
            </div>

            <div className="flex flex-col gap-2 md:min-w-[220px]">
              <button
                type="button"
                onClick={acceptAll}
                className="w-full rounded-xl px-4 py-2.5 font-medium text-white transition"
                style={{ backgroundColor: "#B88746" }}
              >
                Prijať všetko
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="w-full rounded-xl px-4 py-2.5 font-medium text-white transition border border-[#333333] hover:border-[#B88746]"
                style={{ backgroundColor: "#141414" }}
              >
                Odmietnuť
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Settings modal
  const Settings = () => (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(null)} />
      <div className={`relative w-full max-w-2xl ${baseCard}`}>
        <div className="p-5 md:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-semibold" style={{ color: "#B88746" }}>
                Nastavenia cookies
              </div>
              <p className="text-sm text-white/80 mt-1">
                Necessary cookies sú vždy zapnuté. Ostatné kategórie si vieš nastaviť.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-[#333333] px-3 py-1.5 text-white/80 hover:text-white hover:border-[#B88746]"
              onClick={() => setOpen(null)}
            >
              Zavrieť
            </button>
          </div>

          <div className="space-y-3">
            <Row
              title="Necessary"
              desc="Zabezpečujú základné fungovanie webu a bezpečnosť."
              checked={true}
              disabled
              onChange={() => {}}
            />
            <Row
              title="Functional"
              desc="Zapamätanie preferencií a zlepšenie používateľského zážitku."
              checked={draft.functional}
              onChange={(v) => setDraft((s) => ({ ...s, functional: v }))}
            />
            <Row
              title="Analytics"
              desc="Meranie návštevnosti a výkonu (GA4 cez GTM)."
              checked={draft.analytics}
              onChange={(v) => setDraft((s) => ({ ...s, analytics: v }))}
            />
            <Row
              title="Marketing"
              desc="Marketingové cookies a reklama (Consent Mode v2)."
              checked={draft.marketing}
              onChange={(v) => setDraft((s) => ({ ...s, marketing: v }))}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:justify-end">
            <button
              type="button"
              onClick={rejectAll}
              className="rounded-xl px-4 py-2.5 font-medium text-white transition border border-[#333333] hover:border-[#B88746]"
              style={{ backgroundColor: "#141414" }}
            >
              Odmietnuť
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-xl px-4 py-2.5 font-medium text-white transition"
              style={{ backgroundColor: "#B88746" }}
            >
              Prijať všetko
            </button>
            <button
              type="button"
              onClick={() => persist(draft)}
              className="rounded-xl px-4 py-2.5 font-medium text-white transition border border-[#333333] hover:border-[#B88746]"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              Uložiť výber
            </button>
          </div>

          <p className="text-xs text-white/60">
            Tip: Nastavenia môžeš kedykoľvek zmeniť cez odkaz „Cookies“ v pätičke.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {open === "banner" && <Banner />}
      {open === "settings" && <Settings />}
    </>
  )
}

function Row({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string
  desc: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#333333] p-4">
      <div className="space-y-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-white/75">{desc}</div>
      </div>

      <label className="inline-flex items-center gap-2 select-none">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border border-[#333333] bg-[#1d1d1d]"
        />
      </label>
    </div>
  )
}