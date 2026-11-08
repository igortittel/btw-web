"use client"

import { AlertCircle, ArrowLeft } from "lucide-react"
import type { OrderFormState, Action, CustomerState, PaymentMethod } from "./useOrderForm"
import {
  ERROR_TEXT_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  inputClass,
} from "@/lib/formStyles"
import {
  validateEmail,
  validateName,
  validatePhone,
} from "@/lib/validation"
import { isAirportPlace } from "@/lib/schwechat"

type Props = {
  state: OrderFormState
  dispatch: React.Dispatch<Action>
}

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "Hotovosťou na mieste",
  card: "Platobnou kartou",
  invoice: "Faktúrou (pre firmy)",
}

export function StepCustomerDetails({ state, dispatch }: Props) {
  const { customer, trip, meta } = state
  const isCompany = trip.personType === "company"
  const destIsAirport = isAirportPlace(trip.destination.placeId, trip.destination.types)

  const setField = <K extends keyof CustomerState>(field: K, value: CustomerState[K]) => {
    dispatch({ type: "SET_CUSTOMER_FIELD", field, value })
  }

  const validateAndContinue = () => {
    const errors: Record<string, string> = {}
    const fnErr = validateName(customer.firstName, "Meno")
    if (fnErr) errors.firstName = fnErr
    const lnErr = validateName(customer.lastName, "Priezvisko")
    if (lnErr) errors.lastName = lnErr
    if (isCompany) {
      const cnErr = validateName(customer.companyName, "Názov spoločnosti")
      if (cnErr) errors.companyName = cnErr
    }
    const emailErr = validateEmail(customer.email)
    if (emailErr) errors.email = emailErr
    const phoneErr = validatePhone(customer.phone)
    if (phoneErr) errors.phone = phoneErr

    if (customer.isDifferentMainPassenger) {
      const mpfErr = validateName(customer.mainPassengerFirstName, "Meno hlavného pasažiera")
      if (mpfErr) errors.mainPassengerFirstName = mpfErr
      const mplErr = validateName(customer.mainPassengerLastName, "Priezvisko hlavného pasažiera")
      if (mplErr) errors.mainPassengerLastName = mplErr
    }

    if (destIsAirport && !customer.flightNumber.trim()) {
      errors.flightNumber = "Pre transfer na letisko je číslo letu povinné."
    }

    if (isCompany && customer.paymentMethod === "invoice" && !customer.orderReference.trim()) {
      errors.orderReference = "Pre fakturáciu uveďte referenčné číslo objednávky."
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors })
      return
    }
    dispatch({ type: "SET_ERRORS", errors: {} })
    dispatch({ type: "GO_STEP", step: 3 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_STEP", step: 1.5 })}
          aria-label="Späť na cenovú ponuku"
          className="text-[#888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Osobné údaje</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className={LABEL_CLASS}>Meno*</label>
          <input
            id="firstName"
            type="text"
            value={customer.firstName}
            onChange={e => setField("firstName", e.target.value)}
            className={inputClass(!!meta.errors.firstName)}
          />
          {meta.errors.firstName && <Err>{meta.errors.firstName}</Err>}
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL_CLASS}>Priezvisko*</label>
          <input
            id="lastName"
            type="text"
            value={customer.lastName}
            onChange={e => setField("lastName", e.target.value)}
            className={inputClass(!!meta.errors.lastName)}
          />
          {meta.errors.lastName && <Err>{meta.errors.lastName}</Err>}
        </div>
      </div>

      {isCompany && (
        <div>
          <label htmlFor="companyName" className={LABEL_CLASS}>Názov spoločnosti*</label>
          <input
            id="companyName"
            type="text"
            value={customer.companyName}
            onChange={e => setField("companyName", e.target.value)}
            className={inputClass(!!meta.errors.companyName)}
          />
          {meta.errors.companyName && <Err>{meta.errors.companyName}</Err>}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>E-mail*</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={customer.email}
            onChange={e => setField("email", e.target.value)}
            className={inputClass(!!meta.errors.email)}
          />
          {meta.errors.email && <Err>{meta.errors.email}</Err>}
        </div>
        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>Telefónne číslo*</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={customer.phone}
            onChange={e => setField("phone", e.target.value)}
            className={inputClass(!!meta.errors.phone)}
          />
          {meta.errors.phone && <Err>{meta.errors.phone}</Err>}
        </div>
      </div>

      {/* Main passenger */}
      <div>
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={customer.isDifferentMainPassenger}
            onChange={e => setField("isDifferentMainPassenger", e.target.checked)}
            className="btw-checkbox"
          />
          <span className="text-sm font-medium text-white">
            Hlavný pasažier je iná osoba než objednávateľ
          </span>
        </label>

        {customer.isDifferentMainPassenger && (
          <div className="mt-3 grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="mpf" className={LABEL_CLASS}>Meno pasažiera*</label>
              <input
                id="mpf"
                type="text"
                value={customer.mainPassengerFirstName}
                onChange={e => setField("mainPassengerFirstName", e.target.value)}
                className={inputClass(!!meta.errors.mainPassengerFirstName)}
              />
              {meta.errors.mainPassengerFirstName && <Err>{meta.errors.mainPassengerFirstName}</Err>}
            </div>
            <div>
              <label htmlFor="mpl" className={LABEL_CLASS}>Priezvisko pasažiera*</label>
              <input
                id="mpl"
                type="text"
                value={customer.mainPassengerLastName}
                onChange={e => setField("mainPassengerLastName", e.target.value)}
                className={inputClass(!!meta.errors.mainPassengerLastName)}
              />
              {meta.errors.mainPassengerLastName && <Err>{meta.errors.mainPassengerLastName}</Err>}
            </div>
          </div>
        )}
      </div>

      {/* Flight number */}
      <div>
        <label htmlFor="flightNumber" className={LABEL_CLASS}>
          Číslo letu{destIsAirport ? "*" : " (voliteľné)"}
        </label>
        <input
          id="flightNumber"
          type="text"
          value={customer.flightNumber}
          onChange={e => setField("flightNumber", e.target.value)}
          placeholder="napr. OS702"
          className={inputClass(!!meta.errors.flightNumber)}
        />
        {meta.errors.flightNumber && <Err>{meta.errors.flightNumber}</Err>}
      </div>

      {/* Payment method */}
      <div>
        <label className={LABEL_CLASS}>Spôsob platby*</label>
        <div className="grid gap-2 md:grid-cols-3">
          {(Object.keys(PAYMENT_LABEL) as PaymentMethod[])
            .filter(m => m !== "invoice" || isCompany)
            .map(m => (
              <label
                key={m}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  customer.paymentMethod === m
                    ? "border-[#B88746] bg-[#B88746]/10"
                    : "border-[#333333] bg-[#1d1d1d] hover:border-[#B88746]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m}
                  checked={customer.paymentMethod === m}
                  onChange={() => setField("paymentMethod", m)}
                  className="accent-[#B88746]"
                />
                <span className="text-sm text-white">{PAYMENT_LABEL[m]}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Order reference for company+invoice */}
      {isCompany && customer.paymentMethod === "invoice" && (
        <div>
          <label htmlFor="orderReference" className={LABEL_CLASS}>
            Referenčné číslo objednávky*
          </label>
          <input
            id="orderReference"
            type="text"
            value={customer.orderReference}
            onChange={e => setField("orderReference", e.target.value)}
            placeholder="napr. PO-2026-0042"
            className={inputClass(!!meta.errors.orderReference)}
          />
          {meta.errors.orderReference && <Err>{meta.errors.orderReference}</Err>}
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={LABEL_CLASS}>Poznámka (voliteľné)</label>
        <textarea
          id="notes"
          value={customer.notes}
          onChange={e => setField("notes", e.target.value)}
          rows={4}
          className={inputClass()}
          placeholder="Doplňujúce informácie k objednávke..."
        />
      </div>

      {/* Nav */}
      <div className="pt-2 flex flex-col md:flex-row gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: "GO_STEP", step: 1.5 })}
          className={SECONDARY_BUTTON_CLASS + " order-2 md:order-1"}
        >
          <ArrowLeft className="w-4 h-4" />
          Späť
        </button>
        <button
          type="button"
          onClick={validateAndContinue}
          className={PRIMARY_BUTTON_CLASS + " order-1 md:order-2 md:ml-auto"}
        >
          Pokračovať na súhrn →
        </button>
      </div>
    </div>
  )
}

function Err({ children }: { children: React.ReactNode }) {
  return (
    <p className={ERROR_TEXT_CLASS}>
      <AlertCircle className="w-4 h-4" />
      {children}
    </p>
  )
}
