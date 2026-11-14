"use client"

import { useEffect, useState } from "react"
import { fetchVehicles, isTransferVehicle } from "@/lib/graphql"
import type { VehicleClass } from "@/lib/pricing"

/** Vehicle shown for a transfer category (same data as /nase-vozidla → Vozidlá na transfer). */
export type TransferVehicleInfo = {
  title: string
  slug: string
  image: string | null
  luggage: number | null
}

export type TransferVehicles = Partial<Record<VehicleClass, TransferVehicleInfo>>

const CATEGORY_TO_CLASS: Record<string, VehicleClass> = {
  "Business Class": "BC",
  "Business Van": "Van",
  "First Class": "FC",
}

let cache: Promise<TransferVehicles> | null = null

function load(): Promise<TransferVehicles> {
  if (!cache) {
    cache = fetchVehicles()
      .then(list => {
        const out: TransferVehicles = {}
        for (const v of list.filter(isTransferVehicle)) {
          // Exact CMS category (getTransferCategory maps "Business Van" to Business Class).
          const cls = CATEGORY_TO_CLASS[(v.popisVozidla?.kategoria || "").trim()]
          if (!cls || out[cls]) continue
          const p = v.popisVozidla
          out[cls] = {
            title: v.title,
            slug: v.slug,
            image: p?.nahlad?.node?.sourceUrl ?? null,
            luggage: Number(p?.batozina) || null,
          }
        }
        return out
      })
      .catch(() => {
        cache = null
        return {}
      })
  }
  return cache
}

/** Loads transfer vehicles from the CMS once per page; empty until loaded or on error. */
export function useTransferVehicles(): TransferVehicles {
  const [vehicles, setVehicles] = useState<TransferVehicles>({})
  useEffect(() => {
    let alive = true
    load().then(v => {
      if (alive) setVehicles(v)
    })
    return () => {
      alive = false
    }
  }, [])
  return vehicles
}
