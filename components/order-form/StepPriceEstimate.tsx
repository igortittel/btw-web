"use client"

import { useEffect } from "react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import type { OrderFormState, Action } from "./useOrderForm"
import { VariantCard } from "./VariantCard"
import { computeVariants, type Variant, MAX_PAX } from "@/lib/pricing"
import { isAirportPlace } from "@/lib/schwechat"
import { AMBER_NOTE_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/formStyles"
import type { DistanceResult } from "@/lib/distance"

type Props = {
  state: OrderFormState
  dispatch: React.Dispatch<Action>
}

export function StepPriceEstimate({ state, dispatch }: Props) {
  const { trip, distance } = state

  // Fetch distance when entering step. StrictMode-safe: uses closure
  // `cancelled` flag instead of a useRef flag that would stick true.
  useEffect(() => {
    if (distance) return
    let cancelled = false
    const controller = new AbortController()

    const run = async () => {
      try {
        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pickup: {
              placeId: trip.pickup.placeId,
              lat: trip.pickup.lat,
              lng: trip.pickup.lng,
            },
            destination: {
              placeId: trip.destination.placeId,
              lat: trip.destination.lat,
              lng: trip.destination.lng,
            },
            waypoints: trip.waypoints.map(w => ({
              placeId: w.placeId,
              lat: w.lat,
              lng: w.lng,
            })),
          }),
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Distance API ${res.status}`)
        const data = (await res.json()) as DistanceResult
        if (!cancelled) {
          dispatch({ type: "SET_DISTANCE", value: data })
        }
      } catch (err) {
        if (cancelled) return
        if ((err as Error).name === "AbortError") return
        console.error("[distance fetch]", err)
        dispatch({
          type: "SET_ERRORS",
          errors: { _form: "Nepodarilo sa spočítať vzdialenosť. Skúste znova." },
        })
      }
    }
    void run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [distance, dispatch, trip.pickup, trip.destination, trip.waypoints])

  // Compute variants whenever distance / inputs change
  useEffect(() => {
    if (!distance) return
    const variants = computeVariants({
      km: distance.km,
      pax: trip.pax,
      destIsAirport: isAirportPlace(trip.destination.placeId, trip.destination.types),
      isReturnTrip: trip.isReturnTrip,
      waypointCount: trip.waypoints.length,
      preferredClass: trip.preferredClass,
    })
    dispatch({ type: "SET_VARIANTS", variants })
  }, [
    distance,
    trip.pax,
    trip.preferredClass,
    trip.isReturnTrip,
    trip.waypoints.length,
    trip.destination.placeId,
    trip.destination.types,
    dispatch,
  ])

  const destIsAirport = isAirportPlace(trip.destination.placeId, trip.destination.types)
  const preferredOverCap =
    trip.preferredClass !== null && trip.pax > capacityOf(trip.preferredClass)
  const tooManyPax = trip.pax > MAX_PAX

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_STEP", step: 1 })}
          aria-label="Späť na krok 1"
          className="text-[#888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Cenová ponuka</h2>
      </div>

      <RouteSummary state={state} />

      {state.meta.errors._form && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/40 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{state.meta.errors._form}</span>
        </div>
      )}

      {tooManyPax && (
        <div className={AMBER_NOTE_CLASS}>
          <strong className="block mb-1 text-[#B88746]">
            Pre viac ako {MAX_PAX} pasažierov nás kontaktujte individuálne.
          </strong>
          tel.{" "}
          <a href="tel:+421905102220" className="underline hover:text-[#B88746]">
            +421 905 102 220
          </a>{" "}
          · email{" "}
          <a href="mailto:btw@btw.sk" className="underline hover:text-[#B88746]">
            btw@btw.sk
          </a>
        </div>
      )}

      {preferredOverCap && !tooManyPax && (
        <div className={AMBER_NOTE_CLASS}>
          <strong className="block mb-1 text-[#B88746]">
            Pre {trip.pax} pasažierov zvolená trieda nestačí.
          </strong>
          Pripravili sme alternatívy — buď upgrade na väčšiu triedu, alebo viac vozidiel rovnakej triedy.
        </div>
      )}

      {!distance && <SkeletonCards />}

      {distance && state.variants.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.variants.map((v, i) => (
            <VariantCard
              key={`${v.class}-${v.vehicleCount}-${i}`}
              variant={v}
              durationSec={distance.durationSec}
              km={trip.isReturnTrip ? distance.km * 2 : distance.km}
              onSelect={() => handleSelect(v, dispatch)}
            />
          ))}
        </div>
      )}

      {distance?.source === "haversine" && (
        <p className="text-xs text-[#666] italic text-center">
          * Vzdialenosť odhadnutá (presnú spočítame po potvrdení objednávky).
        </p>
      )}

      {destIsAirport && (
        <p className="text-xs text-[#888] text-center">
          Minimálna cena pre transfer na letisko je 65 € za vozidlo.
        </p>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_STEP", step: 1 })}
          className={SECONDARY_BUTTON_CLASS + " w-full md:w-auto"}
        >
          <ArrowLeft className="w-4 h-4" />
          Upraviť trasu
        </button>
      </div>
    </div>
  )
}

function handleSelect(variant: Variant, dispatch: React.Dispatch<Action>) {
  dispatch({ type: "SELECT_VARIANT", variant })
  dispatch({ type: "GO_STEP", step: 2 })
}

function capacityOf(cls: "BC" | "Van" | "FC"): number {
  return { BC: 3, Van: 7, FC: 2 }[cls]
}

function RouteSummary({ state }: { state: OrderFormState }) {
  const { trip } = state
  const parts = [trip.pickup.address, ...trip.waypoints.map(w => w.address), trip.destination.address].filter(Boolean)
  return (
    <div className="p-4 rounded-lg bg-[#0f0f0f] border border-[#1d1d1d] text-sm">
      <p className="text-[#888] mb-1">Trasa</p>
      <p className="text-white break-words leading-relaxed">
        {parts.join("  →  ")}
      </p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#888]">
        <span>{trip.date} · {trip.time}</span>
        <span>· {trip.pax} pax</span>
        {trip.isReturnTrip && <span>· spiatočná</span>}
        {trip.waypoints.length > 0 && <span>· {trip.waypoints.length} medzizastávka{trip.waypoints.length > 1 ? "y" : ""}</span>}
      </div>
    </div>
  )
}

function SkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 animate-pulse"
        >
          <div className="h-10 w-10 bg-[#1d1d1d] rounded-lg mb-4" />
          <div className="h-4 w-32 bg-[#1d1d1d] rounded mb-2" />
          <div className="h-3 w-20 bg-[#1d1d1d] rounded mb-6" />
          <div className="h-8 w-28 bg-[#1d1d1d] rounded mb-2" />
          <div className="h-3 w-24 bg-[#1d1d1d] rounded" />
        </div>
      ))}
      <p className="col-span-full text-center text-sm text-[#888]">
        Počítame vzdialenosť a ceny...
      </p>
    </div>
  )
}
