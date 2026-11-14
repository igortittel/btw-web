"use client"

import { Car, Truck, Crown, Users, Briefcase, Route, ArrowRight } from "lucide-react"
import type { Variant } from "@/lib/pricing"
import { CLASS_LABEL, CAPACITY } from "@/lib/pricing"
import type { TransferVehicleInfo } from "./useTransferVehicles"

type Props = {
  variant: Variant
  vehicle?: TransferVehicleInfo
  durationSec: number
  km: number
  isReturnTrip?: boolean
  onSelect: () => void
}

export function VehicleIcon({ cls, className }: { cls: Variant["class"]; className?: string }) {
  if (cls === "Van") return <Truck className={className} />
  if (cls === "FC") return <Crown className={className} />
  return <Car className={className} />
}

/** Vehicle photo from /nase-vozidla, or the class icon while it loads / if missing. */
export function VehicleImage({
  cls,
  vehicle,
  className = "",
}: {
  cls: Variant["class"]
  vehicle?: TransferVehicleInfo
  className?: string
}) {
  return (
    <div
      className={
        "flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#121212] " +
        className
      }
    >
      {vehicle?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vehicle.image}
          alt={vehicle.title}
          loading="lazy"
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <VehicleIcon cls={cls} className="h-8 w-8 text-[#B88746]" />
      )}
    </div>
  )
}

export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} s`
  const totalMin = Math.round(sec / 60)
  if (totalMin < 60) return `cca ${totalMin} min`
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return m === 0 ? `cca ${h} h` : `cca ${h} h ${m} min`
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function luggageLabel(n: number): string {
  return `${n} ${n === 1 ? "kufor" : n < 5 ? "kufre" : "kufrov"}`
}

function Spec({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[#AAAAAA]">
      <span className="text-[#B88746]">{icon}</span>
      {children}
    </span>
  )
}

export function VariantCard({ variant, vehicle, durationSec, km, isReturnTrip, onSelect }: Props) {
  const multi = variant.vehicleCount > 1
  const capacity = CAPACITY[variant.class] * variant.vehicleCount
  const luggage = vehicle?.luggage ? vehicle.luggage * variant.vehicleCount : null

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full text-left rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4 transition-colors hover:border-[#B88746] focus-visible:border-[#B88746] focus-visible:outline-none sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Vehicle */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <VehicleImage
            cls={variant.class}
            vehicle={vehicle}
            className="h-20 w-28 flex-shrink-0 sm:h-24 sm:w-40"
          />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight text-white sm:text-xl">
              {multi && <span className="text-[#B88746]">{variant.vehicleCount}× </span>}
              {CLASS_LABEL[variant.class]}
            </h3>
            {vehicle?.title && (
              <p className="mt-0.5 text-sm leading-snug text-[#888]">{vehicle.title}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <Spec icon={<Users className="h-4 w-4" />}>do {capacity} os.</Spec>
              {luggage && <Spec icon={<Briefcase className="h-4 w-4" />}>{luggageLabel(luggage)}</Spec>}
              <Spec icon={<Route className="h-4 w-4" />}>
                {km.toLocaleString("sk-SK")} km · {formatDuration(durationSec)}
              </Spec>
            </div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-4 border-t border-[#222] pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="sm:text-right">
            <p className="text-3xl font-bold leading-none text-[#B88746]">
              {formatEur(variant.totalPrice)} €
            </p>
            <p className="mt-1 text-xs text-[#888]">
              bez DPH
              {isReturnTrip && " · tam aj späť"}
              {multi && ` · ${formatEur(variant.pricePerVehicle)} € / vozidlo`}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#B88746] px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-[#A67C52]">
            Vybrať
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}
