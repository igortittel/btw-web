"use client"

import { useEffect } from "react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import type { OrderFormState, Action } from "./useOrderForm"
import { VariantCard } from "./VariantCard"
import { TripRoute } from "./TripRoute"
import { useTransferVehicles } from "./useTransferVehicles"
import { type Variant, MAX_PAX, CAPACITY, WAITING, NIGHT_SURCHARGE, isNightTime } from "@/lib/pricing"
import { isSchwechat } from "@/lib/places"
import { AMBER_NOTE_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/formStyles"
import type { DistanceResult } from "@/lib/distance"

type Props = {
  state: OrderFormState
  dispatch: React.Dispatch<Action>
}

export function StepPriceEstimate({ state, dispatch }: Props) {
  const { trip, distance } = state
  const vehicles = useTransferVehicles()

  // Fetch the authoritative quote (distances + prices) from the server every
  // time the step is entered or a price-relevant input changes.
  const quoteInput = JSON.stringify({
    pickup: trip.pickup,
    destination: trip.destination,
    waypoints: trip.waypoints,
    time: trip.time,
    pax: trip.pax,
    isReturnTrip: trip.isReturnTrip,
    returnTime: trip.returnTime,
    preferredClass: trip.preferredClass,
  })

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    dispatch({ type: "INVALIDATE_PRICE" })

    const run = async () => {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: quoteInput,
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Quote API ${res.status}`)
        const data = (await res.json()) as { distance: DistanceResult; variants: Variant[] }
        if (!cancelled) {
          dispatch({ type: "SET_DISTANCE", value: data.distance })
          dispatch({ type: "SET_VARIANTS", variants: data.variants })
        }
      } catch (err) {
        if (cancelled) return
        if ((err as Error).name === "AbortError") return
        console.error("[quote fetch]", err)
        dispatch({
          type: "SET_ERRORS",
          errors: { _form: "Nepodarilo sa spočítať cenu. Skúste znova." },
        })
      }
    }
    void run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [quoteInput, dispatch])

  const touchesAirport = isSchwechat(trip.destination) || isSchwechat(trip.pickup)
  const night = isNightTime(trip.time) || (trip.isReturnTrip && isNightTime(trip.returnTime))
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

      <section className="rounded-2xl border border-[#1d1d1d] bg-[#0f0f0f] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Vaša cesta</h3>
          <button
            type="button"
            onClick={() => dispatch({ type: "GO_STEP", step: 1 })}
            className="text-sm text-[#B88746] hover:underline"
          >
            Upraviť
          </button>
        </div>
        <TripRoute trip={trip} />
      </section>

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
            Pre {trip.pax} os. zvolená kategória nestačí.
          </strong>
          Vyberte si väčšie vozidlo alebo viac vozidiel zvolenej kategórie.
        </div>
      )}

      {!distance && (
        <SkeletonCards
          count={trip.preferredClass && trip.pax <= capacityOf(trip.preferredClass) ? 1 : 3}
        />
      )}

      {distance && state.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">
            {state.variants.length === 1 ? "Vaše vozidlo" : "Vyberte vozidlo"}
          </h3>
          {state.variants.map((v, i) => (
            <VariantCard
              key={`${v.class}-${v.vehicleCount}-${i}`}
              variant={v}
              vehicle={vehicles[v.class]}
              durationSec={distance.durationSec}
              km={distance.km}
              isReturnTrip={trip.isReturnTrip}
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

      {distance && state.variants.length > 0 && (
        <div className="text-xs text-[#888] space-y-1 text-center">
          <p>Všetky ceny sú uvedené bez DPH.</p>
          {night && (
            <p>Cena obsahuje nočný príplatok {NIGHT_SURCHARGE} € (22:00 – 06:00).</p>
          )}
          <p>
            Čakanie: bezplatne {touchesAirport ? `${WAITING.freeAirportMin / 60} hodina na letisku` : `${WAITING.freeOtherMin} minút`}
            , potom {touchesAirport ? "za každú začatú hodinu" : "za každých začatých 30 minút"}{" "}
            {WAITING.perBlock.BC} € (Business Class) / {WAITING.perBlock.Van} € (Business Van).
          </p>
        </div>
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
  return CAPACITY[cls]
}

function SkeletonCards({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#111] p-4 sm:p-5"
        >
          <div className="h-20 w-28 flex-shrink-0 rounded-xl bg-[#1d1d1d] sm:h-24 sm:w-40" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 rounded bg-[#1d1d1d]" />
            <div className="h-3 w-56 max-w-full rounded bg-[#1d1d1d]" />
          </div>
          <div className="hidden h-9 w-24 rounded bg-[#1d1d1d] sm:block" />
        </div>
      ))}
      <p className="text-center text-sm text-[#888]">Počítame vzdialenosť a ceny…</p>
    </div>
  )
}
