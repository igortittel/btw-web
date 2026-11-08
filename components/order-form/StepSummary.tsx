"use client"

import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import type { OrderFormState, Action } from "./useOrderForm"
import {
  AMBER_NOTE_CLASS,
  ERROR_TEXT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "@/lib/formStyles"
import { CLASS_LABEL, RATE } from "@/lib/pricing"
import { PaymentGateway } from "./PaymentGateway"
import { clearStorage } from "./useOrderForm"

type Props = {
  state: OrderFormState
  dispatch: React.Dispatch<Action>
}

const PAYMENT_LABEL = {
  cash: "Hotovosťou na mieste",
  card: "Platobnou kartou",
  invoice: "Faktúrou",
} as const

function formatEur(n: number): string {
  return new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

export function StepSummary({ state, dispatch }: Props) {
  const { trip, customer, consents, selectedVariant, distance, meta } = state

  if (!selectedVariant || !distance) {
    return (
      <div className={AMBER_NOTE_CLASS}>
        Niečo sa stratilo v ceste. Prosím začnite znova od kroku 1.
      </div>
    )
  }

  const effKm = trip.isReturnTrip ? distance.km * 2 : distance.km
  const subtotal = selectedVariant.pricePerVehicle * selectedVariant.vehicleCount
  const waypointSurcharge = trip.waypoints.length * 10
  const rate = RATE[selectedVariant.class]

  const submit = async () => {
    if (!consents.gdpr) {
      dispatch({ type: "SET_ERRORS", errors: { gdpr: "Súhlas s GDPR je povinný." } })
      return
    }
    dispatch({ type: "SUBMIT_START" })
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip: {
            pickup: trip.pickup,
            destination: trip.destination,
            waypoints: trip.waypoints,
            date: trip.date,
            time: trip.time,
            pax: trip.pax,
            isReturnTrip: trip.isReturnTrip,
            returnDate: trip.returnDate,
            returnTime: trip.returnTime,
            personType: trip.personType,
          },
          distance,
          variant: {
            class: selectedVariant.class,
            vehicleCount: selectedVariant.vehicleCount,
            pricePerVehicle: selectedVariant.pricePerVehicle,
            totalPrice: selectedVariant.totalPrice,
          },
          customer,
          consents,
          meta: { startedAt: meta.startedAt, source: "objednavka-v1" },
          website: "",
        }),
      })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({ error: "Odoslanie zlyhalo." }))) as { error?: string }
        dispatch({ type: "SUBMIT_ERROR", message: err.error || "Odoslanie zlyhalo." })
        return
      }
      clearStorage()
      dispatch({ type: "SUBMIT_SUCCESS" })
    } catch (err) {
      console.error(err)
      dispatch({
        type: "SUBMIT_ERROR",
        message: "Spojenie zlyhalo. Skúste prosím znova.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_STEP", step: 2 })}
          aria-label="Späť na osobné údaje"
          className="text-[#888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Súhrn objednávky</h2>
      </div>

      {/* Trip recap */}
      <Section title="Cesta">
        <p className="text-white leading-relaxed break-words">
          {[trip.pickup.address, ...trip.waypoints.map(w => w.address), trip.destination.address]
            .filter(Boolean)
            .join("  →  ")}
        </p>
        <p className="text-sm text-[#888] mt-2">
          {trip.date} · {trip.time} · {trip.pax} pax
          {trip.isReturnTrip && ` · spiatočná ${trip.returnDate} ${trip.returnTime}`}
        </p>
      </Section>

      {/* Vehicle */}
      <Section title="Vozidlo">
        <p className="text-white">
          {selectedVariant.vehicleCount > 1 && `${selectedVariant.vehicleCount}× `}
          {CLASS_LABEL[selectedVariant.class]}
        </p>
        <p className="text-sm text-[#888] mt-1">
          {customer.flightNumber && `Let: ${customer.flightNumber} · `}
          Platba: {PAYMENT_LABEL[customer.paymentMethod]}
        </p>
      </Section>

      {/* Customer */}
      <Section title="Objednávateľ">
        <p className="text-white">
          {trip.personType === "company" && customer.companyName && (
            <>
              {customer.companyName}
              <br />
            </>
          )}
          {customer.firstName} {customer.lastName}
        </p>
        <p className="text-sm text-[#888] mt-1">
          {customer.email} · {customer.phone}
        </p>
        {customer.isDifferentMainPassenger && (
          <p className="text-sm text-[#888] mt-1">
            Hlavný pasažier: {customer.mainPassengerFirstName}{" "}
            {customer.mainPassengerLastName}
          </p>
        )}
        {customer.notes && (
          <p className="text-sm text-[#888] mt-2 whitespace-pre-wrap">
            Poznámka: {customer.notes}
          </p>
        )}
      </Section>

      {/* Price breakdown */}
      <Section title="Cena">
        <dl className="space-y-1 text-sm">
          <Row
            label={`${distance.km.toLocaleString("sk-SK")} km × ${rate.toFixed(2)} €/km`}
            value={`${formatEur(effKm * rate)} €`}
            muted
          />
          {trip.isReturnTrip && (
            <Row label="× 2 (spiatočná cesta)" value="" muted />
          )}
          {selectedVariant.vehicleCount > 1 && (
            <Row
              label={`× ${selectedVariant.vehicleCount} vozidiel`}
              value={`${formatEur(subtotal)} €`}
              muted
            />
          )}
          {waypointSurcharge > 0 && (
            <Row
              label={`+ ${trip.waypoints.length} medzizastávka${trip.waypoints.length > 1 ? "y" : ""}`}
              value={`+ ${formatEur(waypointSurcharge)} €`}
              muted
            />
          )}
          <div className="border-t border-[#2a2a2a] my-2" />
          <Row
            label="Celkom"
            value={`${formatEur(selectedVariant.totalPrice)} €`}
            bold
          />
        </dl>
      </Section>

      <PaymentGateway variant={selectedVariant} method={customer.paymentMethod} />

      {/* Consents */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consents.gdpr}
            onChange={e => dispatch({ type: "SET_CONSENT", field: "gdpr", value: e.target.checked })}
            className="btw-checkbox mt-0.5"
          />
          <span className="text-sm text-[#CCCCCC] leading-relaxed">
            Súhlasím so{" "}
            <a href="/ochrana-osobnych-udajov" className="underline hover:text-[#B88746]" target="_blank" rel="noopener">
              spracovaním osobných údajov
            </a>{" "}
            a{" "}
            <a href="/vseobecne-obchodne-podmienky" className="underline hover:text-[#B88746]" target="_blank" rel="noopener">
              obchodnými podmienkami
            </a>
            . *
          </span>
        </label>
        {meta.errors.gdpr && (
          <p className={ERROR_TEXT_CLASS}>
            <AlertCircle className="w-4 h-4" />
            {meta.errors.gdpr}
          </p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consents.marketing}
            onChange={e => dispatch({ type: "SET_CONSENT", field: "marketing", value: e.target.checked })}
            className="btw-checkbox mt-0.5"
          />
          <span className="text-sm text-[#888888] leading-relaxed">
            Súhlasím so zasielaním marketingových ponúk (voliteľné).
          </span>
        </label>
      </div>

      {/* Honeypot (hidden from users, bots fill it) */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Form-level error */}
      {meta.errors._form && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/40 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{meta.errors._form}</span>
        </div>
      )}

      {/* Submit */}
      <div className="pt-2 flex flex-col md:flex-row gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_STEP", step: 2 })}
          disabled={meta.submitting}
          className={SECONDARY_BUTTON_CLASS + " order-2 md:order-1"}
        >
          <ArrowLeft className="w-4 h-4" />
          Späť
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={meta.submitting}
          className={PRIMARY_BUTTON_CLASS + " order-1 md:order-2 md:ml-auto"}
        >
          {meta.submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Odosielam…
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Záväzne objednať
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="p-4 rounded-lg bg-[#0f0f0f] border border-[#1d1d1d]">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-2">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string
  value: string
  muted?: boolean
  bold?: boolean
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? "text-[#888]" : "text-white"}>{label}</dt>
      <dd className={bold ? "text-[#B88746] font-bold text-lg" : muted ? "text-[#888]" : "text-white"}>
        {value}
      </dd>
    </div>
  )
}
