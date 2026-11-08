"use client"

import { useEffect, useReducer, useRef } from "react"
import type { DistanceResult } from "@/lib/distance"
import type { Variant, VehicleClass } from "@/lib/pricing"

export type PlaceValue = {
  address: string
  placeId: string
  lat: number
  lng: number
  types?: string[]
}

export const EMPTY_PLACE: PlaceValue = {
  address: "",
  placeId: "",
  lat: 0,
  lng: 0,
  types: [],
}

export type Step = 1 | 1.5 | 2 | 3

export type PaymentMethod = "cash" | "card" | "invoice"

export type TripState = {
  personType: "individual" | "company"
  pickup: PlaceValue
  destination: PlaceValue
  waypoints: PlaceValue[]
  date: string
  time: string
  pax: number
  preferredClass: VehicleClass | null
  isReturnTrip: boolean
  returnDate: string
  returnTime: string
}

export type CustomerState = {
  firstName: string
  lastName: string
  companyName: string
  email: string
  phone: string
  isDifferentMainPassenger: boolean
  mainPassengerFirstName: string
  mainPassengerLastName: string
  flightNumber: string
  orderReference: string
  paymentMethod: PaymentMethod
  notes: string
}

export type ConsentsState = {
  gdpr: boolean
  marketing: boolean
}

export type MetaState = {
  startedAt: number
  submitting: boolean
  errors: Record<string, string>
}

export type OrderFormState = {
  step: Step
  submitted: boolean
  trip: TripState
  distance: DistanceResult | null
  variants: Variant[]
  selectedVariant: Variant | null
  customer: CustomerState
  consents: ConsentsState
  meta: MetaState
}

const INITIAL_TRIP: TripState = {
  personType: "individual",
  pickup: EMPTY_PLACE,
  destination: EMPTY_PLACE,
  waypoints: [],
  date: "",
  time: "",
  pax: 1,
  preferredClass: null,
  isReturnTrip: false,
  returnDate: "",
  returnTime: "",
}

const INITIAL_CUSTOMER: CustomerState = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  isDifferentMainPassenger: false,
  mainPassengerFirstName: "",
  mainPassengerLastName: "",
  flightNumber: "",
  orderReference: "",
  paymentMethod: "cash",
  notes: "",
}

export const INITIAL_STATE: OrderFormState = {
  step: 1,
  submitted: false,
  trip: INITIAL_TRIP,
  distance: null,
  variants: [],
  selectedVariant: null,
  customer: INITIAL_CUSTOMER,
  consents: { gdpr: false, marketing: false },
  meta: { startedAt: Date.now(), submitting: false, errors: {} },
}

export type Action =
  | { type: "SET_TRIP_FIELD"; field: keyof TripState; value: any }
  | { type: "SET_PICKUP"; value: PlaceValue }
  | { type: "SET_DESTINATION"; value: PlaceValue }
  | { type: "ADD_WAYPOINT" }
  | { type: "SET_WAYPOINT"; index: number; value: PlaceValue }
  | { type: "REMOVE_WAYPOINT"; index: number }
  | { type: "GO_STEP"; step: Step }
  | { type: "SET_DISTANCE"; value: DistanceResult | null }
  | { type: "SET_VARIANTS"; variants: Variant[] }
  | { type: "SELECT_VARIANT"; variant: Variant | null }
  | { type: "SET_CUSTOMER_FIELD"; field: keyof CustomerState; value: any }
  | { type: "SET_CONSENT"; field: keyof ConsentsState; value: boolean }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string }
  | { type: "INVALIDATE_PRICE" }
  | { type: "HYDRATE"; state: OrderFormState }
  | { type: "RESET" }

function reducer(state: OrderFormState, action: Action): OrderFormState {
  switch (action.type) {
    case "SET_TRIP_FIELD":
      return { ...state, trip: { ...state.trip, [action.field]: action.value } }
    case "SET_PICKUP":
      return {
        ...state,
        trip: { ...state.trip, pickup: action.value },
        distance: null,
        variants: [],
        selectedVariant: null,
      }
    case "SET_DESTINATION":
      return {
        ...state,
        trip: { ...state.trip, destination: action.value },
        distance: null,
        variants: [],
        selectedVariant: null,
      }
    case "ADD_WAYPOINT":
      if (state.trip.waypoints.length >= 5) return state
      return {
        ...state,
        trip: { ...state.trip, waypoints: [...state.trip.waypoints, EMPTY_PLACE] },
        distance: null,
        variants: [],
        selectedVariant: null,
      }
    case "SET_WAYPOINT": {
      const next = [...state.trip.waypoints]
      next[action.index] = action.value
      return {
        ...state,
        trip: { ...state.trip, waypoints: next },
        distance: null,
        variants: [],
        selectedVariant: null,
      }
    }
    case "REMOVE_WAYPOINT": {
      const next = state.trip.waypoints.filter((_, i) => i !== action.index)
      return {
        ...state,
        trip: { ...state.trip, waypoints: next },
        distance: null,
        variants: [],
        selectedVariant: null,
      }
    }
    case "GO_STEP":
      return { ...state, step: action.step }
    case "SET_DISTANCE":
      return { ...state, distance: action.value }
    case "SET_VARIANTS":
      return { ...state, variants: action.variants }
    case "SELECT_VARIANT":
      return { ...state, selectedVariant: action.variant }
    case "SET_CUSTOMER_FIELD":
      return { ...state, customer: { ...state.customer, [action.field]: action.value } }
    case "SET_CONSENT":
      return { ...state, consents: { ...state.consents, [action.field]: action.value } }
    case "SET_ERRORS":
      return { ...state, meta: { ...state.meta, errors: action.errors } }
    case "SUBMIT_START":
      return { ...state, meta: { ...state.meta, submitting: true, errors: {} } }
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submitted: true,
        meta: { ...state.meta, submitting: false, errors: {} },
      }
    case "SUBMIT_ERROR":
      return {
        ...state,
        meta: { ...state.meta, submitting: false, errors: { _form: action.message } },
      }
    case "INVALIDATE_PRICE":
      return { ...state, distance: null, variants: [], selectedVariant: null }
    case "HYDRATE":
      return action.state
    case "RESET":
      return { ...INITIAL_STATE, meta: { ...INITIAL_STATE.meta, startedAt: Date.now() } }
    default:
      return state
  }
}

const STORAGE_KEY = "btw.order.v1"
const DEBOUNCE_MS = 300

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function loadFromStorage(): OrderFormState | null {
  if (!isBrowser()) return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as OrderFormState
    if (typeof parsed !== "object" || parsed === null) return null
    return parsed
  } catch {
    return null
  }
}

function saveToStorage(state: OrderFormState) {
  if (!isBrowser()) return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota or incognito — silently fail */
  }
}

export function clearStorage() {
  if (!isBrowser()) return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* silent */
  }
}

export function useOrderForm() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const hydrated = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (hydrated.current) return
    const stored = loadFromStorage()
    if (stored) {
      dispatch({ type: "HYDRATE", state: stored })
    }
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveToStorage(state), DEBOUNCE_MS)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state])

  return { state, dispatch }
}
