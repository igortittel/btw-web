// lib/consent.ts
export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing"

export type ConsentState = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: number
  version: number
}

const STORAGE_KEY = "btw_consent_v1"
const COOKIE_NAME = "btw_consent"

export const CONSENT_VERSION = 1

export const defaultConsentState: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  updatedAt: Date.now(),
  version: CONSENT_VERSION,
}

// --- Google Consent Mode v2 mapping (advanced)
export function toGtagConsent(state: ConsentState) {
  return {
    // Always granted for essential security cookies
    security_storage: "granted",

    // Functional
    functionality_storage: state.functional ? "granted" : "denied",
    personalization_storage: state.functional ? "granted" : "denied",

    // Analytics
    analytics_storage: state.analytics ? "granted" : "denied",

    // Marketing / Ads (Consent Mode v2)
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  } as const
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    if (!parsed || parsed.version !== CONSENT_VERSION) return null
    // ensure necessary always true
    return { ...parsed, necessary: true }
  } catch {
    return null
  }
}

export function writeConsent(state: ConsentState) {
  if (typeof window === "undefined") return
  const safe: ConsentState = { ...state, necessary: true, updatedAt: Date.now(), version: CONSENT_VERSION }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))

  // Also store a minimal cookie (useful for audits / basic server awareness)
  // 180 days
  const maxAge = 60 * 60 * 24 * 180
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(safe))}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
    __btwConsent?: ConsentState
    BTW_openCookieSettings?: () => void
  }
}

export function ensureGtagShim() {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: any[]) {
      window.dataLayer!.push(args)
    }
}

export function applyConsentToGtag(state: ConsentState) {
  ensureGtagShim()
  window.__btwConsent = state
  const payload = toGtagConsent(state)
  // Consent Mode v2 (advanced): update
  window.gtag!("consent", "update", payload)
}