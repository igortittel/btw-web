"use client"

import { useCallback, useEffect, useRef } from "react"
import type { PlaceValue } from "./useOrderForm"

const BOUNDS = {
  sw: { lat: 47.0, lng: 16.0 },
  ne: { lat: 49.0, lng: 18.5 },
}

type GoogleAutocomplete = {
  getPlace: () => {
    formatted_address?: string
    place_id?: string
    name?: string
    types?: string[]
    geometry?: { location?: { lat: () => number; lng: () => number } }
  }
  addListener: (event: string, cb: () => void) => void
}

type GoogleNamespace = {
  maps: {
    LatLngBounds: new (sw: object, ne: object) => object
    places: {
      Autocomplete: new (
        input: HTMLInputElement,
        opts: Record<string, unknown>,
      ) => GoogleAutocomplete
    }
  }
}

function buildLabel(place: ReturnType<GoogleAutocomplete["getPlace"]>): string {
  const name = place.name || ""
  const addr = place.formatted_address || ""
  return name && !addr.startsWith(name) ? `${name}, ${addr}` : addr
}

function readGoogle(): GoogleNamespace | null {
  const g = (typeof window !== "undefined" ? (window as unknown as { google?: GoogleNamespace }).google : undefined)
  if (!g?.maps?.places) return null
  return g
}

export type UseGooglePlacesOptions = {
  onChange: (place: PlaceValue) => void
  ready: boolean
}

/**
 * Attach Google Places autocomplete to an input via the returned `attach` ref callback.
 * Safe to render before the Google Maps SDK finishes loading — the hook retries
 * initialization as soon as `ready` flips to true.
 */
export function useGooglePlaces({ onChange, ready }: UseGooglePlacesOptions) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const elRef = useRef<HTMLInputElement | null>(null)
  const initializedRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const initialize = useCallback(() => {
    const el = elRef.current
    if (!el) return
    if (initializedRef.current) return
    if (!ready) return
    const g = readGoogle()
    if (!g) return

    const opts = {
      fields: ["formatted_address", "place_id", "geometry", "name", "types"],
      types: ["geocode", "establishment"],
      bounds: new g.maps.LatLngBounds(BOUNDS.sw, BOUNDS.ne),
      strictBounds: false,
    }
    const ac = new g.maps.places.Autocomplete(el, opts)
    let selected = false

    ac.addListener("place_changed", () => {
      selected = true
      const place = ac.getPlace() || {}
      const label = buildLabel(place)
      if (label) el.value = label
      const lat = place.geometry?.location?.lat?.()
      const lng = place.geometry?.location?.lng?.()
      onChangeRef.current({
        address: label,
        placeId: place.place_id || "",
        lat: typeof lat === "number" ? lat : 0,
        lng: typeof lng === "number" ? lng : 0,
        types: place.types || [],
      })
    })

    const onInput = () => {
      if (!selected) return
      selected = false
      onChangeRef.current({
        address: el.value,
        placeId: "",
        lat: 0,
        lng: 0,
        types: [],
      })
    }
    el.addEventListener("input", onInput)

    initializedRef.current = true
    cleanupRef.current = () => {
      el.removeEventListener("input", onInput)
    }
  }, [ready])

  const attach = useCallback(
    (el: HTMLInputElement | null) => {
      if (el === elRef.current) return
      // New element (or unmount): tear down previous attachment
      cleanupRef.current?.()
      cleanupRef.current = null
      initializedRef.current = false
      elRef.current = el
      if (el) initialize()
    },
    [initialize],
  )

  // When `ready` flips (or initialize is otherwise invalidated),
  // attempt initialization — this handles the case where the input
  // mounted BEFORE the Google Maps SDK finished loading.
  useEffect(() => {
    initialize()
  }, [initialize])

  return { attach }
}
