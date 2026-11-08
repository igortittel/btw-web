"use client"

import { useCallback, useState } from "react"
import { AlertCircle, Plus, X } from "lucide-react"
import type { OrderFormState, Action, TripState, PlaceValue } from "./useOrderForm"
import { useGooglePlaces } from "./useGooglePlaces"
import { SchwechatPrompt } from "./SchwechatPrompt"
import {
  SCHWECHAT_PLACE_ID,
  SCHWECHAT_LABEL,
  shouldOfferSchwechatPrompt,
} from "@/lib/schwechat"
import {
  inputClass,
  LABEL_CLASS,
  ERROR_TEXT_CLASS,
  PRIMARY_BUTTON_CLASS,
  AMBER_NOTE_CLASS,
} from "@/lib/formStyles"
import {
  validateDateAfter,
  validateDateFuture,
  validatePax,
  validatePlace,
  validateTime,
} from "@/lib/validation"
import type { VehicleClass } from "@/lib/pricing"
import { CLASS_LABEL } from "@/lib/pricing"

type Props = {
  state: OrderFormState
  dispatch: React.Dispatch<Action>
  mapsReady: boolean
}

export function StepTripInfo({ state, dispatch, mapsReady }: Props) {
  const { trip, meta } = state
  const [destinationPromptDismissed, setDestinationPromptDismissed] = useState(false)

  const destinationOffersSchwechat =
    !destinationPromptDismissed &&
    trip.destination.placeId !== SCHWECHAT_PLACE_ID &&
    shouldOfferSchwechatPrompt(trip.destination.address, trip.destination.types)

  const pickupPlaces = useGooglePlaces({
    ready: mapsReady,
    onChange: p => dispatch({ type: "SET_PICKUP", value: p }),
  })
  const destinationPlaces = useGooglePlaces({
    ready: mapsReady,
    onChange: p => {
      dispatch({ type: "SET_DESTINATION", value: p })
      setDestinationPromptDismissed(false)
    },
  })

  const setTripField = useCallback(
    <K extends keyof TripState>(field: K, value: TripState[K]) => {
      dispatch({ type: "SET_TRIP_FIELD", field, value })
    },
    [dispatch],
  )

  const confirmSchwechat = () => {
    dispatch({
      type: "SET_DESTINATION",
      value: {
        address: SCHWECHAT_LABEL,
        placeId: SCHWECHAT_PLACE_ID,
        lat: 48.1102,
        lng: 16.5697,
        types: ["airport"],
      },
    })
    setDestinationPromptDismissed(true)
    // Update the input value directly (ref managed by autocomplete)
    const inp = document.querySelector<HTMLInputElement>("input[name=destinationAddress]")
    if (inp) inp.value = SCHWECHAT_LABEL
  }

  const validateAndContinue = () => {
    const errors: Record<string, string> = {}
    const pickupErr = validatePlace(trip.pickup.address, trip.pickup.placeId, "Adresa vyzdvihnutia")
    if (pickupErr) errors.pickupAddress = pickupErr
    const destErr = validatePlace(trip.destination.address, trip.destination.placeId, "Cieľová adresa")
    if (destErr) errors.destinationAddress = destErr
    trip.waypoints.forEach((wp, i) => {
      const wpErr = validatePlace(wp.address, wp.placeId, `Medzizastávka ${i + 1}`)
      if (wpErr) errors[`waypoint${i}`] = wpErr
    })
    const dateErr = validateDateFuture(trip.date)
    if (dateErr) errors.date = dateErr
    const timeErr = validateTime(trip.time)
    if (timeErr) errors.time = timeErr
    const paxErr = validatePax(trip.pax)
    if (paxErr) errors.pax = paxErr

    if (trip.isReturnTrip) {
      const rDateErr = validateDateAfter(trip.returnDate, trip.date)
      if (rDateErr) errors.returnDate = rDateErr
      const rTimeErr = validateTime(trip.returnTime)
      if (rTimeErr) errors.returnTime = rTimeErr
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors })
      return
    }
    dispatch({ type: "SET_ERRORS", errors: {} })
    dispatch({ type: "GO_STEP", step: 1.5 })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Info o ceste</h2>

      {/* Person type */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setTripField("personType", "individual")}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            trip.personType === "individual"
              ? "bg-[#B88746] text-white"
              : "bg-[#1d1d1d] border border-[#333333] text-white hover:border-[#B88746]"
          }`}
          aria-pressed={trip.personType === "individual"}
        >
          Fyzická osoba
        </button>
        <button
          type="button"
          onClick={() => setTripField("personType", "company")}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            trip.personType === "company"
              ? "bg-[#B88746] text-white"
              : "bg-[#1d1d1d] border border-[#333333] text-white hover:border-[#B88746]"
          }`}
          aria-pressed={trip.personType === "company"}
        >
          Firma
        </button>
      </div>

      {/* Pickup */}
      <div>
        <label htmlFor="pickupAddress" className={LABEL_CLASS}>
          Adresa vyzdvihnutia*
        </label>
        <input
          ref={pickupPlaces.attach}
          id="pickupAddress"
          name="pickupAddress"
          type="text"
          defaultValue={trip.pickup.address}
          placeholder="Zadajte adresu vyzdvihnutia"
          autoComplete="off"
          className={inputClass(!!meta.errors.pickupAddress)}
        />
        {meta.errors.pickupAddress && <ErrorRow>{meta.errors.pickupAddress}</ErrorRow>}
      </div>

      {/* Waypoints */}
      <WaypointList
        waypoints={trip.waypoints}
        dispatch={dispatch}
        mapsReady={mapsReady}
        errors={meta.errors}
      />

      {/* Destination */}
      <div>
        <label htmlFor="destinationAddress" className={LABEL_CLASS}>
          Cieľová adresa*
        </label>
        <input
          ref={destinationPlaces.attach}
          id="destinationAddress"
          name="destinationAddress"
          type="text"
          defaultValue={trip.destination.address}
          placeholder="Zadajte cieľovú adresu"
          autoComplete="off"
          className={inputClass(!!meta.errors.destinationAddress)}
        />
        {meta.errors.destinationAddress && (
          <ErrorRow>{meta.errors.destinationAddress}</ErrorRow>
        )}
        {destinationOffersSchwechat && (
          <SchwechatPrompt
            onConfirm={confirmSchwechat}
            onDismiss={() => setDestinationPromptDismissed(true)}
          />
        )}
      </div>

      {/* Date + Time */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className={LABEL_CLASS}>Dátum*</label>
          <input
            id="date"
            type="date"
            value={trip.date}
            onChange={e => setTripField("date", e.target.value)}
            className={inputClass(!!meta.errors.date)}
          />
          {meta.errors.date && <ErrorRow>{meta.errors.date}</ErrorRow>}
        </div>
        <div>
          <label htmlFor="time" className={LABEL_CLASS}>Čas*</label>
          <input
            id="time"
            type="time"
            value={trip.time}
            onChange={e => setTripField("time", e.target.value)}
            className={inputClass(!!meta.errors.time)}
          />
          {meta.errors.time && <ErrorRow>{meta.errors.time}</ErrorRow>}
        </div>
      </div>

      {/* Pax + preferredClass */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pax" className={LABEL_CLASS}>Počet pasažierov*</label>
          <input
            id="pax"
            type="number"
            min={1}
            max={20}
            value={trip.pax}
            onChange={e => setTripField("pax", Math.max(1, Number(e.target.value) || 1))}
            className={inputClass(!!meta.errors.pax)}
          />
          {meta.errors.pax && <ErrorRow>{meta.errors.pax}</ErrorRow>}
        </div>
        <div>
          <label htmlFor="preferredClass" className={LABEL_CLASS}>
            Kategória vozidla
          </label>
          <select
            id="preferredClass"
            value={trip.preferredClass ?? ""}
            onChange={e =>
              setTripField("preferredClass", (e.target.value || null) as VehicleClass | null)
            }
            className={inputClass() + " appearance-none"}
          >
            <option value="">Nezáleží — porovnám ceny</option>
            <option value="BC">{CLASS_LABEL.BC} (do 3 pax)</option>
            <option value="Van">{CLASS_LABEL.Van} (do 7 pax)</option>
            <option value="FC">{CLASS_LABEL.FC} (do 2 pax)</option>
          </select>
        </div>
      </div>

      {/* Return trip */}
      <div>
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={trip.isReturnTrip}
            onChange={e => setTripField("isReturnTrip", e.target.checked)}
            className="btw-checkbox"
          />
          <span className="text-sm font-medium text-white">Spiatočná cesta</span>
        </label>

        {trip.isReturnTrip && (
          <div className="mt-4 grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="returnDate" className={LABEL_CLASS}>Dátum návratu*</label>
              <input
                id="returnDate"
                type="date"
                value={trip.returnDate}
                min={trip.date || undefined}
                onChange={e => setTripField("returnDate", e.target.value)}
                className={inputClass(!!meta.errors.returnDate)}
              />
              {meta.errors.returnDate && <ErrorRow>{meta.errors.returnDate}</ErrorRow>}
            </div>
            <div>
              <label htmlFor="returnTime" className={LABEL_CLASS}>Čas návratu*</label>
              <input
                id="returnTime"
                type="time"
                value={trip.returnTime}
                onChange={e => setTripField("returnTime", e.target.value)}
                className={inputClass(!!meta.errors.returnTime)}
              />
              {meta.errors.returnTime && <ErrorRow>{meta.errors.returnTime}</ErrorRow>}
            </div>
          </div>
        )}
      </div>

      {/* Capacity disclaimer */}
      <div className={AMBER_NOTE_CLASS}>
        <strong className="block mb-1 text-[#B88746]">Kapacita vozidiel:</strong>
        Business Class max 3, Business Van max 7, First Class max 2. Pri presahujúcom počte
        v ďalšom kroku ponúkneme upgrade alebo viac vozidiel + porovnanie cien.
      </div>

      {/* CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={validateAndContinue}
          className={PRIMARY_BUTTON_CLASS + " w-full md:w-auto"}
        >
          Pokračovať na cenu →
        </button>
      </div>
    </div>
  )
}

function ErrorRow({ children }: { children: React.ReactNode }) {
  return (
    <p className={ERROR_TEXT_CLASS}>
      <AlertCircle className="w-4 h-4" />
      {children}
    </p>
  )
}

function WaypointList({
  waypoints,
  dispatch,
  mapsReady,
  errors,
}: {
  waypoints: PlaceValue[]
  dispatch: React.Dispatch<Action>
  mapsReady: boolean
  errors: Record<string, string>
}) {
  const atMax = waypoints.length >= 5
  return (
    <div className="space-y-3">
      {waypoints.map((wp, i) => (
        <WaypointInput
          key={i}
          index={i}
          value={wp}
          dispatch={dispatch}
          mapsReady={mapsReady}
          error={errors[`waypoint${i}`]}
        />
      ))}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[#2a2a2a]" />
        <button
          type="button"
          onClick={() => dispatch({ type: "ADD_WAYPOINT" })}
          disabled={atMax}
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#B88746] transition-colors whitespace-nowrap disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          Pridať medzizastávku
          <span className="text-xs border border-[#B88746]/40 text-[#B88746] px-2 py-0.5 rounded-full">
            +10 €
          </span>
        </button>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>
    </div>
  )
}

function WaypointInput({
  index,
  value,
  dispatch,
  mapsReady,
  error,
}: {
  index: number
  value: PlaceValue
  dispatch: React.Dispatch<Action>
  mapsReady: boolean
  error?: string
}) {
  const places = useGooglePlaces({
    ready: mapsReady,
    onChange: p => dispatch({ type: "SET_WAYPOINT", index, value: p }),
  })

  return (
    <div>
      <label className={LABEL_CLASS}>
        Medzizastávka {index + 1}
      </label>
      <div className="flex gap-2">
        <input
          ref={places.attach}
          type="text"
          defaultValue={value.address}
          placeholder={`Medzizastávka ${index + 1}`}
          autoComplete="off"
          className={inputClass(!!error) + " flex-1"}
        />
        <button
          type="button"
          onClick={() => dispatch({ type: "REMOVE_WAYPOINT", index })}
          aria-label="Odstrániť medzizastávku"
          className="bg-[#1d1d1d] border border-[#333333] hover:border-red-500 hover:text-red-500 text-[#888888] rounded-lg px-3 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && <ErrorRow>{error}</ErrorRow>}
    </div>
  )
}

