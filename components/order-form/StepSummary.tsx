"use client"

import { AlertCircle, ArrowLeft, Briefcase, CheckCircle, Loader2, Route, Users } from "lucide-react"
import type { OrderFormState, Action } from "./useOrderForm"
import { TripRoute } from "./TripRoute"
import { VehicleImage, formatDuration, luggageLabel } from "./VariantCard"
import { useTransferVehicles } from "./useTransferVehicles"
import {
  AMBER_NOTE_CLASS,
  ERROR_TEXT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "@/lib/formStyles"
import { CAPACITY, CLASS_LABEL } from "@/lib/pricing"
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
  const vehicles = useTransferVehicles()
  const vehicle = selectedVariant ? vehicles[selectedVariant.class] : undefined

  if (!selectedVariant || !distance) {
    return (
      <div className={AMBER_NOTE_CLASS}>
        Niečo sa stratilo v ceste. Prosím začnite znova od kroku 1.
      </div>
    )
  }


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
      <Section title="Cesta" onEdit={() => dispatch({ type: "GO_STEP", step: 1 })}>
        <TripRoute trip={trip} />
      </Section>

      {/* Vehicle */}
      <Section title="Vozidlo" onEdit={() => dispatch({ type: "GO_STEP", step: 1.5 })}>
        <div className="flex items-center gap-4">
          <VehicleImage
            cls={selectedVariant.class}
            vehicle={vehicle}
            className="h-20 w-28 flex-shrink-0 sm:h-24 sm:w-40"
          />
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-tight text-white">
              {selectedVariant.vehicleCount > 1 && (
                <span className="text-[#B88746]">{selectedVariant.vehicleCount}× </span>
              )}
              {CLASS_LABEL[selectedVariant.class]}
            </p>
            {vehicle?.title && <p className="mt-0.5 text-sm text-[#888]">{vehicle.title}</p>}
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#AAAAAA]">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#B88746]" />
                do {CAPACITY[selectedVariant.class] * selectedVariant.vehicleCount} os.
              </span>
              {vehicle?.luggage && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-[#B88746]" />
                  {luggageLabel(vehicle.luggage * selectedVariant.vehicleCount)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Route className="h-4 w-4 text-[#B88746]" />
                {distance.km.toLocaleString("sk-SK")} km · {formatDuration(distance.durationSec)}
              </span>
            </p>
          </div>
        </div>
      </Section>

      {/* Customer */}
      <Section title="Objednávateľ" onEdit={() => dispatch({ type: "GO_STEP", step: 2 })}>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {trip.personType === "company" && customer.companyName && (
            <Field label="Spoločnosť" value={customer.companyName} />
          )}
          <Field label="Meno a priezvisko" value={`${customer.firstName} ${customer.lastName}`} />
          <Field label="E-mail" value={customer.email} />
          <Field label="Telefón" value={customer.phone} />
          {customer.isDifferentMainPassenger && (
            <Field
              label="Hlavný pasažier"
              value={`${customer.mainPassengerFirstName} ${customer.mainPassengerLastName}`}
            />
          )}
          {customer.flightNumber && <Field label="Číslo letu" value={customer.flightNumber} />}
          {customer.orderReference && (
            <Field label="Referenčné číslo objednávky" value={customer.orderReference} />
          )}
          <Field label="Platba" value={PAYMENT_LABEL[customer.paymentMethod]} />
          {customer.notes && (
            <div className="sm:col-span-2">
              <Field label="Poznámka" value={customer.notes} multiline />
            </div>
          )}
        </dl>
      </Section>

      {/* Price breakdown */}
      <Section title="Cena">
        <dl className="space-y-1 text-sm">
          {(selectedVariant.breakdown ?? []).map((line, i) => (
            <Row
              key={i}
              label={line.label}
              value={`${line.amount < 0 ? "− " : ""}${formatEur(Math.abs(line.amount))} €`}
              muted
            />
          ))}
          {selectedVariant.vehicleCount > 1 && (
            <Row
              label={`${formatEur(selectedVariant.pricePerVehicle)} € × ${selectedVariant.vehicleCount} vozidlá`}
              value=""
              muted
            />
          )}
          <div className="border-t border-[#2a2a2a] my-2" />
          <Row
            label="Celkom bez DPH"
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

function Section({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit?: () => void
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#1d1d1d] bg-[#0f0f0f] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">{title}</h3>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-sm text-[#B88746] hover:underline">
            Upraviť
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[#888]">{label}</dt>
      <dd className={"mt-0.5 break-words text-white" + (multiline ? " whitespace-pre-wrap" : "")}>
        {value}
      </dd>
    </div>
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
