"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Script from "next/script"

interface FormState {
  success?: boolean
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

interface Waypoint {
  id: string
  placeId: string
  lat: string
  lng: string
}

const VEHICLE_CATEGORIES = ["Business Van", "Business Class", "First Class", "Nezáleží"]
const MAX_WAYPOINTS = 5

// --- Module-level components (stable references, no remounting) ---

const PassengerDisclaimer = () => (
  <div className="p-4 rounded-lg border border-[#B88746]/40 bg-[#B88746]/10 text-sm text-[#D4A96A] leading-relaxed">
    <strong className="block mb-1 text-[#B88746]">Upozornenie na kapacitu vozidiel:</strong>
    Vozidlá kategórie Business Class a First Class majú maximálny počet pasažierov 3. Vozidlá kategórie Business Van majú maximálny počet pasažierov 7. V prípade presahujúceho počtu pasažierov zvolenej kategórie vozidla bude potrebné navýšiť počet vozidiel, čo znamená zvýšenie celkovej ceny za transfer.
  </div>
)

const WaypointLimitDisclaimer = () => (
  <div className="p-4 rounded-lg border border-[#B88746]/40 bg-[#B88746]/10 text-sm text-[#D4A96A] leading-relaxed">
    <strong className="block mb-1 text-[#B88746]">Pre viac medzizastávok a komplexnejšiu objednávku nás kontaktujte individuálne:</strong>
    <span className="block mt-1">
      tel.: <a href="tel:+421905102220" className="underline hover:text-[#B88746]">+421 905 102 220</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      email: <a href="mailto:btw@btw.sk" className="underline hover:text-[#B88746]">btw@btw.sk</a>
    </span>
  </div>
)

const WaypointAddButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-[#2a2a2a]" />
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#B88746] transition-colors whitespace-nowrap disabled:opacity-40">
      + Pridať medzizastávku
      <span className="text-xs border border-[#B88746]/40 text-[#B88746] px-2 py-0.5 rounded-full">+10 EUR</span>
    </button>
    <div className="flex-1 h-px bg-[#2a2a2a]" />
  </div>
)

// ----------------------------------------------------------------

export function ReservationFormTest() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>({})
  const formRef = useRef<HTMLFormElement>(null)

  const [mapsLoaded, setMapsLoaded] = useState(false)
  const returnAutocompleteInitialized = useRef(false)

  // Waypoints — track which exact DOM element is autocomplete-initialized
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [returnWaypoints, setReturnWaypoints] = useState<Waypoint[]>([])
  const waypointInputsRef = useRef<Record<string, HTMLInputElement | null>>({})
  const returnWaypointInputsRef = useRef<Record<string, HTMLInputElement | null>>({})
  // Map<wpId, element> — avoids re-init unless the DOM node changed
  const waypointAcElements = useRef<Map<string, HTMLInputElement>>(new Map())
  const returnWaypointAcElements = useRef<Map<string, HTMLInputElement>>(new Map())

  // Main trip
  const dateInputRef = useRef<HTMLInputElement>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)
  const pickupAddressRef = useRef<HTMLInputElement>(null)
  const destinationAddressRef = useRef<HTMLInputElement>(null)
  const [pickupPlaceId, setPickupPlaceId] = useState("")
  const [pickupLat, setPickupLat] = useState("")
  const [pickupLng, setPickupLng] = useState("")
  const [destinationPlaceId, setDestinationPlaceId] = useState("")
  const [destinationLat, setDestinationLat] = useState("")
  const [destinationLng, setDestinationLng] = useState("")
  const [passengerCount, setPassengerCount] = useState(0)

  // Return trip
  const returnDateInputRef = useRef<HTMLInputElement>(null)
  const returnTimeInputRef = useRef<HTMLInputElement>(null)
  const returnPickupAddressRef = useRef<HTMLInputElement>(null)
  const returnDestinationAddressRef = useRef<HTMLInputElement>(null)
  const [returnPickupPlaceId, setReturnPickupPlaceId] = useState("")
  const [returnPickupLat, setReturnPickupLat] = useState("")
  const [returnPickupLng, setReturnPickupLng] = useState("")
  const [returnDestinationPlaceId, setReturnDestinationPlaceId] = useState("")
  const [returnDestinationLat, setReturnDestinationLat] = useState("")
  const [returnDestinationLng, setReturnDestinationLng] = useState("")
  const [returnPassengerCount, setReturnPassengerCount] = useState(0)

  const [personType, setPersonType] = useState<"individual" | "company">("individual")
  const [isDifferentMainPassenger, setIsDifferentMainPassenger] = useState(false)
  const [isReturnTrip, setIsReturnTrip] = useState(false)
  const [isReturnSamePassenger, setIsReturnSamePassenger] = useState(true)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [startedAt] = useState(() => Date.now())

  const buildLabel = (place: any) => {
    const name = place.name || ""
    const addr = place.formatted_address || ""
    return name && !addr.startsWith(name) ? `${name}, ${addr}` : addr
  }

  const makeAutocompleteOptions = (g: any) => ({
    fields: ["formatted_address", "place_id", "geometry", "name"],
    types: ["geocode", "establishment"],
    bounds: new g.maps.LatLngBounds({ lat: 47.0, lng: 16.0 }, { lat: 49.0, lng: 18.5 }),
    strictBounds: false,
  })

  const attachAutocomplete = (
    g: any,
    inputRef: React.RefObject<HTMLInputElement | null>,
    setPlaceId: (v: string) => void,
    setLat: (v: string) => void,
    setLng: (v: string) => void,
  ) => {
    if (!inputRef.current) return
    const opts = makeAutocompleteOptions(g)
    const ac = new g.maps.places.Autocomplete(inputRef.current, opts)
    let selected = false
    ac.addListener("place_changed", () => {
      selected = true
      const place = ac.getPlace() || {}
      const label = buildLabel(place)
      if (inputRef.current && label) inputRef.current.value = label
      setPlaceId(place.place_id || "")
      const lat = place?.geometry?.location?.lat?.()
      const lng = place?.geometry?.location?.lng?.()
      setLat(typeof lat === "number" ? String(lat) : "")
      setLng(typeof lng === "number" ? String(lng) : "")
    })
    inputRef.current.addEventListener("input", () => {
      if (!selected) return
      selected = false
      setPlaceId(""); setLat(""); setLng("")
    })
  }

  // Attach autocomplete to a waypoint input. Tracks the actual DOM element
  // so that if the node is remounted a new autocomplete is correctly attached.
  const attachWaypointAutocomplete = (
    g: any,
    el: HTMLInputElement,
    wpId: string,
    setWps: React.Dispatch<React.SetStateAction<Waypoint[]>>,
    acElements: React.MutableRefObject<Map<string, HTMLInputElement>>,
  ) => {
    if (acElements.current.get(wpId) === el) return // same node → already initialized
    const opts = makeAutocompleteOptions(g)
    const ac = new g.maps.places.Autocomplete(el, opts)
    let selected = false
    ac.addListener("place_changed", () => {
      selected = true
      const place = ac.getPlace() || {}
      const label = buildLabel(place)
      if (label) el.value = label
      const lat = place?.geometry?.location?.lat?.()
      const lng = place?.geometry?.location?.lng?.()
      setWps(prev => prev.map(w => w.id === wpId ? {
        ...w,
        placeId: place.place_id || "",
        lat: typeof lat === "number" ? String(lat) : "",
        lng: typeof lng === "number" ? String(lng) : "",
      } : w))
    })
    el.addEventListener("input", () => {
      if (!selected) return
      selected = false
      setWps(prev => prev.map(w => w.id === wpId ? { ...w, placeId: "", lat: "", lng: "" } : w))
    })
    acElements.current.set(wpId, el)
  }

  const initOutboundAutocomplete = () => {
    const g = (window as any)?.google
    if (!g?.maps?.places) return
    attachAutocomplete(g, pickupAddressRef, setPickupPlaceId, setPickupLat, setPickupLng)
    attachAutocomplete(g, destinationAddressRef, setDestinationPlaceId, setDestinationLat, setDestinationLng)
  }

  const initReturnAutocomplete = () => {
    const g = (window as any)?.google
    if (!g?.maps?.places) return
    attachAutocomplete(g, returnPickupAddressRef, setReturnPickupPlaceId, setReturnPickupLat, setReturnPickupLng)
    attachAutocomplete(g, returnDestinationAddressRef, setReturnDestinationPlaceId, setReturnDestinationLat, setReturnDestinationLng)
    returnAutocompleteInitialized.current = true
  }

  // Initialize autocomplete for any new/remounted waypoint inputs
  useEffect(() => {
    if (!mapsLoaded) return
    const g = (window as any)?.google
    if (!g?.maps?.places) return
    waypoints.forEach(wp => {
      const el = waypointInputsRef.current[wp.id]
      if (el) attachWaypointAutocomplete(g, el, wp.id, setWaypoints, waypointAcElements)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypoints, mapsLoaded])

  useEffect(() => {
    if (!mapsLoaded) return
    const g = (window as any)?.google
    if (!g?.maps?.places) return
    returnWaypoints.forEach(wp => {
      const el = returnWaypointInputsRef.current[wp.id]
      if (el) attachWaypointAutocomplete(g, el, wp.id, setReturnWaypoints, returnWaypointAcElements)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnWaypoints, mapsLoaded])

  useEffect(() => {
    if (!isReturnTrip) { returnAutocompleteInitialized.current = false; return }
    if (mapsLoaded && !returnAutocompleteInitialized.current) initReturnAutocomplete()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturnTrip, mapsLoaded])

  const addWaypoint = () => {
    if (waypoints.length >= MAX_WAYPOINTS) return
    setWaypoints(prev => [...prev, { id: `wp-${Date.now()}`, placeId: "", lat: "", lng: "" }])
  }
  const removeWaypoint = (id: string) => {
    setWaypoints(prev => prev.filter(w => w.id !== id))
    waypointAcElements.current.delete(id)
    delete waypointInputsRef.current[id]
  }
  const addReturnWaypoint = () => {
    if (returnWaypoints.length >= MAX_WAYPOINTS) return
    setReturnWaypoints(prev => [...prev, { id: `rwp-${Date.now()}`, placeId: "", lat: "", lng: "" }])
  }
  const removeReturnWaypoint = (id: string) => {
    setReturnWaypoints(prev => prev.filter(w => w.id !== id))
    returnWaypointAcElements.current.delete(id)
    delete returnWaypointInputsRef.current[id]
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState({})

    const formData = new FormData(e.currentTarget)
    formData.set("startedAt", String(startedAt))
    formData.set("waypointCount", String(waypoints.length))
    waypoints.forEach((wp, i) => {
      formData.set(`waypointPlaceId_${i}`, wp.placeId)
      formData.set(`waypointLat_${i}`, wp.lat)
      formData.set(`waypointLng_${i}`, wp.lng)
    })
    formData.set("returnWaypointCount", String(returnWaypoints.length))
    returnWaypoints.forEach((wp, i) => {
      formData.set(`returnWaypointPlaceId_${i}`, wp.placeId)
      formData.set(`returnWaypointLat_${i}`, wp.lat)
      formData.set(`returnWaypointLng_${i}`, wp.lng)
    })

    const errors: FormState["errors"] = {}
    if (personType === "company") {
      if (!formData.get("companyName")?.toString().trim()) errors.companyName = "Názov spoločnosti je povinný."
    }
    if (isDifferentMainPassenger) {
      if (!formData.get("mainPassengerFirstName")?.toString().trim()) errors.mainPassengerFirstName = "Meno pasažiera je povinné."
      if (!formData.get("mainPassengerLastName")?.toString().trim()) errors.mainPassengerLastName = "Priezvisko pasažiera je povinné."
    }
    if (isReturnTrip) {
      if ((formData.get("returnPickupAddress")?.toString().trim() || "").length < 5) errors.returnPickupAddress = "Adresa vyzdvihnutia spiatočnej cesty je povinná."
      if ((formData.get("returnDestinationAddress")?.toString().trim() || "").length < 5) errors.returnDestinationAddress = "Cieľová adresa spiatočnej cesty je povinná."
      const rdVal = formData.get("returnDate")?.toString() ?? ""
      const primaryDateVal = formData.get("date")?.toString() ?? ""
      if (!rdVal) {
        errors.returnDate = "Dátum spiatočnej cesty je povinný."
      } else if (primaryDateVal && rdVal < primaryDateVal) {
        errors.returnDate = "Dátum spiatočnej cesty nemôže byť skorší ako dátum primárnej cesty."
      }
      if (!formData.get("returnTime")) errors.returnTime = "Čas spiatočnej cesty je povinný."
      const rp = parseInt(formData.get("returnPassengers")?.toString() || "", 10)
      if (isNaN(rp) || rp < 1 || rp > 20) errors.returnPassengers = "Počet pasažierov musí byť číslo od 1 do 20."
      if (!VEHICLE_CATEGORIES.includes(formData.get("returnVehicleCategory")?.toString() || "")) errors.returnVehicleCategory = "Vyberte kategóriu vozidla spiatočnej cesty."
      if (!isReturnSamePassenger) {
        if ((formData.get("returnPassengerFirstName")?.toString().trim() || "").length < 2) errors.returnPassengerFirstName = "Meno pasažiera je povinné."
        if ((formData.get("returnPassengerLastName")?.toString().trim() || "").length < 2) errors.returnPassengerLastName = "Priezvisko pasažiera je povinné."
      }
    }
    if (formData.get("gdprConsent") !== "true") {
      errors.gdprConsent = "Na odoslanie formulára je potrebný súhlas so spracovaním osobných údajov."
    }
    if (Object.keys(errors).length > 0) {
      setFormState({ success: false, errors, message: "Prosím opravte chyby vo formulári." })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/reservation", { method: "POST", body: formData })
      const rawText = await response.text()
      let result: any = null
      try { result = rawText ? JSON.parse(rawText) : null } catch { result = null }
      if (!response.ok && !result) throw new Error(`Request failed (${response.status})`)
      if (result?.success) {
        setFormState({ success: true, message: result.message })
        if (formRef.current) formRef.current.reset()
        setPersonType("individual"); setIsDifferentMainPassenger(false)
        setIsReturnTrip(false); setIsReturnSamePassenger(true)
        setGdprConsent(false); setMarketingConsent(false)
        setPassengerCount(0); setReturnPassengerCount(0)
        setWaypoints([]); setReturnWaypoints([])
        waypointAcElements.current.clear(); returnWaypointAcElements.current.clear()
        waypointInputsRef.current = {}; returnWaypointInputsRef.current = {}
        setPickupPlaceId(""); setPickupLat(""); setPickupLng("")
        setDestinationPlaceId(""); setDestinationLat(""); setDestinationLng("")
        setReturnPickupPlaceId(""); setReturnPickupLat(""); setReturnPickupLng("")
        setReturnDestinationPlaceId(""); setReturnDestinationLat(""); setReturnDestinationLng("")
        setTimeout(() => {
          document.getElementById("form-message")?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      } else {
        setFormState({ success: false, message: result?.message || "Nastala chyba pri odosielaní správy.", errors: result?.errors })
      }
    } catch {
      setFormState({ success: false, message: "Chyba pripojenia. Skontrolujte internetové pripojenie a skúste to znovu." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Inline helper — not a React component, avoids remounting issues
  const renderWaypoints = (
    wps: Waypoint[],
    inputsRef: React.MutableRefObject<Record<string, HTMLInputElement | null>>,
    onAdd: () => void,
    onRemove: (id: string) => void,
    namePrefix: string,
  ) => (
    <>
      {wps.map((wp, i) => (
        <div key={wp.id}>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-white">
              Medzizastávka{wps.length > 1 ? ` ${i + 1}` : ""}
            </label>
            <button type="button" disabled={isSubmitting} onClick={() => onRemove(wp.id)}
              className="text-xs text-[#666666] hover:text-white transition-colors">
              × Odstrániť
            </button>
          </div>
          <Input
            ref={(el) => { inputsRef.current[wp.id] = el }}
            name={`${namePrefix}_${i}`}
            placeholder="Zadajte medzizastávku (autocomplete)"
            disabled={isSubmitting}
            className="bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors focus:border-[#B88746]"
          />
          <input type="hidden" name={`${namePrefix}PlaceId_${i}`} value={wp.placeId} />
          <input type="hidden" name={`${namePrefix}Lat_${i}`} value={wp.lat} />
          <input type="hidden" name={`${namePrefix}Lng_${i}`} value={wp.lng} />
        </div>
      ))}
      {wps.length < MAX_WAYPOINTS && <WaypointAddButton onClick={onAdd} disabled={isSubmitting} />}
      {wps.length === MAX_WAYPOINTS && <WaypointLimitDisclaimer />}
    </>
  )

  return (
    <section className="py-12 px-6 bg-[#1D1D1D]">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=sk&region=SK`}
        strategy="afterInteractive"
        onLoad={() => { setMapsLoaded(true); initOutboundAutocomplete() }}
      />
      <style jsx global>{`
        input.no-picker-icon[type="date"]::-webkit-calendar-picker-indicator,
        input.no-picker-icon[type="time"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
        input.no-picker-icon[type="date"]::-webkit-inner-spin-button,
        input.no-picker-icon[type="date"]::-webkit-clear-button,
        input.no-picker-icon[type="time"]::-webkit-inner-spin-button,
        input.no-picker-icon[type="time"]::-webkit-clear-button { display: none; }
        input.no-picker-icon[type="date"], input.no-picker-icon[type="time"] { -webkit-appearance: none; appearance: none; }
        .pac-container { background: #1d1d1d; border: 1px solid #333333; border-radius: 10px; box-shadow: 0 12px 30px rgba(0,0,0,0.45); z-index: 99999; overflow: hidden; }
        .pac-container .pac-item { color: #ffffff; padding: 10px 12px; border-top: 1px solid #2a2a2a; cursor: pointer; font-size: 14px; }
        .pac-container .pac-item:first-child { border-top: none; }
        .pac-container .pac-item:hover { background: #141414; }
        .pac-container .pac-item-query { color: #ffffff; }
        .pac-container .pac-matched { color: #B88746; font-weight: 700; }
        input.btw-checkbox { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border: 1px solid #333333; background: #1d1d1d; border-radius: 4px; display: inline-block; vertical-align: middle; cursor: pointer; transition: border-color 150ms ease, background-color 150ms ease; background-position: center; background-repeat: no-repeat; background-size: 14px 14px; flex-shrink: 0; }
        input.btw-checkbox:checked { border-color: #B88746; background-color: #B88746; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E"); }
        input.btw-checkbox:focus-visible { outline: 2px solid rgba(184,135,70,0.6); outline-offset: 2px; }
        input.btw-checkbox:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">

          {/* Person Type */}
          <div className="flex gap-4 mb-4">
            <input type="hidden" name="personType" value={personType} />
            <button type="button" onClick={() => setPersonType("individual")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${personType === "individual" ? "bg-[#B88746] text-white" : "bg-[#1d1d1d] border border-[#333333] text-white hover:border-[#B88746]"}`}
              aria-pressed={personType === "individual"}>Fyzická osoba</button>
            <button type="button" onClick={() => setPersonType("company")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${personType === "company" ? "bg-[#B88746] text-white" : "bg-[#1d1d1d] border border-[#333333] text-white hover:border-[#B88746]"}`}
              aria-pressed={personType === "company"}>Firma</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Meno*</label>
              <Input name="firstName" placeholder="Meno" required disabled={isSubmitting}
                className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.firstName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
              {formState?.errors?.firstName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Priezvisko*</label>
              <Input name="lastName" placeholder="Priezvisko" required disabled={isSubmitting}
                className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.lastName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
              {formState?.errors?.lastName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.lastName}</p>}
            </div>
          </div>

          {personType === "company" && (
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Názov spoločnosti*</label>
              <Input name="companyName" placeholder="Názov spoločnosti" required={personType === "company"} disabled={isSubmitting}
                className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.companyName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
              {formState?.errors?.companyName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.companyName}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3 text-white">E-mail*</label>
            <Input type="email" name="email" placeholder="E-mail" required disabled={isSubmitting}
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.email ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
            {formState?.errors?.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Tel číslo*</label>
            <Input type="tel" name="phone" placeholder="Telefónne číslo" required disabled={isSubmitting}
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.phone ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
            {formState?.errors?.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.phone}</p>}
          </div>

          {/* Pickup */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Adresa vyzdvihnutia*</label>
            <Input ref={pickupAddressRef} name="pickupAddress"
              placeholder="Zadajte adresu vyzdvihnutia (autocomplete)" required disabled={isSubmitting}
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.pickupAddress ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
            <input type="hidden" name="pickupPlaceId" value={pickupPlaceId} />
            <input type="hidden" name="pickupLat" value={pickupLat} />
            <input type="hidden" name="pickupLng" value={pickupLng} />
            {formState?.errors?.pickupAddress && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.pickupAddress}</p>}
          </div>

          {/* Main waypoints */}
          {renderWaypoints(waypoints, waypointInputsRef, addWaypoint, removeWaypoint, "waypointAddress")}

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Cieľová adresa*</label>
            <Input ref={destinationAddressRef} name="destinationAddress"
              placeholder="Zadajte cieľovú adresu (autocomplete)" required disabled={isSubmitting}
              className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.destinationAddress ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
            <input type="hidden" name="destinationPlaceId" value={destinationPlaceId} />
            <input type="hidden" name="destinationLat" value={destinationLat} />
            <input type="hidden" name="destinationLng" value={destinationLng} />
            {formState?.errors?.destinationAddress && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.destinationAddress}</p>}
          </div>

          {/* Date + Time */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Dátum*</label>
              <Input ref={dateInputRef} type="date" name="date"
                onClick={() => dateInputRef.current?.showPicker?.()}
                className={`bg-[#1d1d1d] border-[#333333] text-white rounded-lg py-3 transition-colors cursor-pointer no-picker-icon ${formState?.errors?.date ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`}
                required disabled={isSubmitting} />
              {formState?.errors?.date && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Čas*</label>
              <Input ref={timeInputRef} type="time" name="time"
                onClick={() => timeInputRef.current?.showPicker?.()}
                className={`bg-[#1d1d1d] border-[#333333] text-white rounded-lg py-3 transition-colors cursor-pointer no-picker-icon ${formState?.errors?.time ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`}
                required disabled={isSubmitting} />
              {formState?.errors?.time && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.time}</p>}
            </div>
          </div>

          {/* Passengers + Return trip */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <label className="block text-sm font-medium mb-3 text-white">Počet pasažierov*</label>
              <Input type="number" name="passengers" min={1} max={20}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className={`bg-[#1d1d1d] border-[#333333] text-white rounded-lg py-3 transition-colors ${formState?.errors?.passengers ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`}
                required disabled={isSubmitting} />
              {formState?.errors?.passengers && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.passengers}</p>}
            </div>
            <div className="flex items-center gap-3 md:pt-9">
              <input type="hidden" name="returnTrip" value={isReturnTrip ? "true" : "false"} />
              <input id="returnTrip" type="checkbox" checked={isReturnTrip}
                onChange={() => setIsReturnTrip(!isReturnTrip)}
                disabled={isSubmitting} className="btw-checkbox" />
              <label htmlFor="returnTrip" className="text-white select-none cursor-pointer">Spiatočná cesta</label>
            </div>
          </div>

          {passengerCount >= 4 && <PassengerDisclaimer />}

          {/* Vehicle Category */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Kategória vozidla*</label>
            <select name="vehicleCategory" required disabled={isSubmitting}
              className="w-full bg-[#1d1d1d] border border-[#333333] text-white rounded-lg py-3 px-4 transition-colors focus:border-[#B88746]">
              <option value="">Vyberte kategóriu</option>
              {VEHICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {formState?.errors?.vehicleCategory && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.vehicleCategory}</p>}
          </div>

          {/* Main passenger toggle */}
          <div className="flex items-center gap-3">
            <input type="hidden" name="sameAsMainPassenger" value={isDifferentMainPassenger ? "false" : "true"} />
            <input id="sameAsMainPassenger" type="checkbox" checked={!isDifferentMainPassenger}
              onChange={() => setIsDifferentMainPassenger(!isDifferentMainPassenger)}
              disabled={isSubmitting} className="btw-checkbox" />
            <label htmlFor="sameAsMainPassenger" className="text-white select-none cursor-pointer">
              Meno a priezvisko je totožné s hlavným pasažierom
            </label>
          </div>

          {isDifferentMainPassenger && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Meno pasažiera*</label>
                <Input name="mainPassengerFirstName" placeholder="Meno pasažiera" required disabled={isSubmitting}
                  className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.mainPassengerFirstName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
                {formState?.errors?.mainPassengerFirstName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.mainPassengerFirstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Priezvisko pasažiera*</label>
                <Input name="mainPassengerLastName" placeholder="Priezvisko pasažiera" required disabled={isSubmitting}
                  className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.mainPassengerLastName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
                {formState?.errors?.mainPassengerLastName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.mainPassengerLastName}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Číslo letu (voliteľné)</label>
            <Input name="flightNumber" placeholder="Číslo letu" disabled={isSubmitting}
              className="bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors focus:border-[#B88746]" />
          </div>

          {/* Return trip section */}
          {isReturnTrip && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-px bg-[#B88746]/35" />
                <span className="text-[#B88746] text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap">Spiatočná cesta</span>
                <div className="flex-1 h-px bg-[#B88746]/35" />
              </div>
              <div className="space-y-8 pl-4 border-l-2 border-[#B88746]/25">

                <div>
                  <label className="block text-sm font-medium mb-3 text-white">Adresa vyzdvihnutia (spiatočná)*</label>
                  <Input ref={returnPickupAddressRef} name="returnPickupAddress"
                    placeholder="Zadajte adresu vyzdvihnutia (autocomplete)" disabled={isSubmitting}
                    className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.returnPickupAddress ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
                  <input type="hidden" name="returnPickupPlaceId" value={returnPickupPlaceId} />
                  <input type="hidden" name="returnPickupLat" value={returnPickupLat} />
                  <input type="hidden" name="returnPickupLng" value={returnPickupLng} />
                  {formState?.errors?.returnPickupAddress && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnPickupAddress}</p>}
                </div>

                {renderWaypoints(returnWaypoints, returnWaypointInputsRef, addReturnWaypoint, removeReturnWaypoint, "returnWaypointAddress")}

                <div>
                  <label className="block text-sm font-medium mb-3 text-white">Cieľová adresa (spiatočná)*</label>
                  <Input ref={returnDestinationAddressRef} name="returnDestinationAddress"
                    placeholder="Zadajte cieľovú adresu (autocomplete)" disabled={isSubmitting}
                    className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.returnDestinationAddress ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
                  <input type="hidden" name="returnDestinationPlaceId" value={returnDestinationPlaceId} />
                  <input type="hidden" name="returnDestinationLat" value={returnDestinationLat} />
                  <input type="hidden" name="returnDestinationLng" value={returnDestinationLng} />
                  {formState?.errors?.returnDestinationAddress && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnDestinationAddress}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white">Dátum spiatočnej cesty*</label>
                    <Input ref={returnDateInputRef} type="date" name="returnDate"
                      onClick={() => returnDateInputRef.current?.showPicker?.()}
                      className={`bg-[#1d1d1d] border-[#333333] text-white rounded-lg py-3 transition-colors cursor-pointer no-picker-icon ${formState?.errors?.returnDate ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`}
                      disabled={isSubmitting} />
                    {formState?.errors?.returnDate && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white">Čas spiatočnej cesty*</label>
                    <Input ref={returnTimeInputRef} type="time" name="returnTime"
                      onClick={() => returnTimeInputRef.current?.showPicker?.()}
                      className={`bg-[#1d1d1d] border-[#333333] text-white rounded-lg py-3 transition-colors cursor-pointer no-picker-icon ${formState?.errors?.returnTime ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`}
                      disabled={isSubmitting} />
                    {formState?.errors?.returnTime && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnTime}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white">Počet pasažierov (spiatočná)*</label>
                    <Input type="number" name="returnPassengers" min={1} max={20}
                      onChange={(e) => setReturnPassengerCount(Number(e.target.value))}
                      className={`bg-[#1d1d1d] border-[#333333] text-white rounded-lg py-3 transition-colors ${formState?.errors?.returnPassengers ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`}
                      disabled={isSubmitting} />
                    {formState?.errors?.returnPassengers && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnPassengers}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-white">Kategória vozidla (spiatočná)*</label>
                    <select name="returnVehicleCategory" disabled={isSubmitting}
                      className={`w-full bg-[#1d1d1d] border border-[#333333] text-white rounded-lg py-3 px-4 transition-colors focus:border-[#B88746] ${formState?.errors?.returnVehicleCategory ? "border-red-500" : ""}`}>
                      <option value="">Vyberte kategóriu</option>
                      {VEHICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {formState?.errors?.returnVehicleCategory && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnVehicleCategory}</p>}
                  </div>
                </div>

                {returnPassengerCount >= 4 && <PassengerDisclaimer />}

                <div className="flex items-center gap-3">
                  <input type="hidden" name="returnSamePassenger" value={isReturnSamePassenger ? "true" : "false"} />
                  <input id="returnSamePassenger" type="checkbox" checked={isReturnSamePassenger}
                    onChange={() => setIsReturnSamePassenger(!isReturnSamePassenger)}
                    disabled={isSubmitting} className="btw-checkbox" />
                  <label htmlFor="returnSamePassenger" className="text-white select-none cursor-pointer">
                    Meno a priezvisko pre spiatočnú cestu je totožné s hlavným pasažierom
                  </label>
                </div>

                {!isReturnSamePassenger && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-white">Meno pasažiera (spiatočná)*</label>
                      <Input name="returnPassengerFirstName" placeholder="Meno pasažiera" disabled={isSubmitting}
                        className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.returnPassengerFirstName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
                      {formState?.errors?.returnPassengerFirstName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnPassengerFirstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3 text-white">Priezvisko pasažiera (spiatočná)*</label>
                      <Input name="returnPassengerLastName" placeholder="Priezvisko pasažiera" disabled={isSubmitting}
                        className={`bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors ${formState?.errors?.returnPassengerLastName ? "border-red-500 focus:border-red-500" : "focus:border-[#B88746]"}`} />
                      {formState?.errors?.returnPassengerLastName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.returnPassengerLastName}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-3 text-white">Číslo letu — spiatočná cesta (voliteľné)</label>
                  <Input name="returnFlightNumber" placeholder="Číslo letu" disabled={isSubmitting}
                    className="bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors focus:border-[#B88746]" />
                </div>

              </div>
            </div>
          )}

          {/* Payment */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Spôsob platby*</label>
            <select name="paymentMethod" required disabled={isSubmitting}
              className="w-full bg-[#1d1d1d] border border-[#333333] text-white rounded-lg py-3 px-4 transition-colors focus:border-[#B88746]">
              <option value="">Vyberte spôsob platby</option>
              {personType === "company" && <option value="Faktúra">Faktúra</option>}
              <option value="Hotovosť na mieste">Hotovosť na mieste</option>
              <option value="Platobnou kartou">Platobnou kartou</option>
            </select>
            {formState?.errors?.paymentMethod && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.paymentMethod}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Poznámky (voliteľné)</label>
            <Textarea name="notes" disabled={isSubmitting}
              placeholder="Napíšte doplňujúce informácie (batožina, autosedačka, preferencie, ...)"
              className="bg-[#1d1d1d] border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 transition-colors focus:border-[#B88746] min-h-[120px]" />
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex flex-col gap-2">
            <input type="hidden" name="gdprConsent" value={gdprConsent ? "true" : "false"} />
            <div className="flex items-center gap-3">
              <input id="gdprConsent" type="checkbox" checked={gdprConsent}
                onChange={() => setGdprConsent(!gdprConsent)}
                disabled={isSubmitting} className="btw-checkbox" />
              <label htmlFor="gdprConsent" className="text-white select-none cursor-pointer">
                Súhlasím so spracovaním osobných údajov podľa{" "}
                <a href="/ochrana-osobnych-udajov" style={{ color: "#B88746", textDecoration: "underline" }}>
                  zásad ochrany osobných údajov
                </a>.*
              </label>
            </div>
            {formState?.errors?.gdprConsent && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{formState.errors.gdprConsent}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input type="hidden" name="marketingConsent" value={marketingConsent ? "true" : "false"} />
            <div className="flex items-center gap-3">
              <input id="marketingConsent" type="checkbox" checked={marketingConsent}
                onChange={() => setMarketingConsent(!marketingConsent)}
                disabled={isSubmitting} className="btw-checkbox" />
              <label htmlFor="marketingConsent" className="text-white select-none cursor-pointer">
                Chcem dostávať výhodné ponuky, zľavy a akcie od By The Wave.
              </label>
            </div>
          </div>

          <div className="text-center">
            <Button type="submit" disabled={isSubmitting}
              className="bg-[#B88746] hover:bg-[#A67C52] text-white px-10 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Odosielam...</>
              ) : "Odoslať nezáväzný dopyt"}
            </Button>
          </div>

          {formState?.message && (
            <div id="form-message"
              className={`text-center p-6 rounded-lg border transition-all duration-300 ${formState.success ? "bg-green-900/20 border-green-500 text-green-400" : "bg-red-900/20 border-red-500 text-red-400"}`}>
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
