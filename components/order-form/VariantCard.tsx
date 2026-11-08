"use client"

import { Car, Truck, Crown, Users, ArrowRight } from "lucide-react"
import type { Variant } from "@/lib/pricing"
import { CLASS_LABEL, CAPACITY } from "@/lib/pricing"

type Props = {
  variant: Variant
  durationSec: number
  km: number
  onSelect: () => void
}

function VehicleIcon({ cls, className }: { cls: Variant["class"]; className?: string }) {
  if (cls === "Van") return <Truck className={className} />
  if (cls === "FC") return <Crown className={className} />
  return <Car className={className} />
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} s`
  const totalMin = Math.round(sec / 60)
  if (totalMin < 60) return `cca ${totalMin} min`
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return m === 0 ? `cca ${h} h` : `cca ${h} h ${m} min`
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function VariantCard({ variant, durationSec, km, onSelect }: Props) {
  const totalCapacity = CAPACITY[variant.class] * variant.vehicleCount
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative w-full text-left bg-[#111111] border border-[#2a2a2a] hover:border-[#B88746] rounded-2xl p-5 md:p-6 transition-colors"
    >
      {variant.isRecommended && (
        <span className="absolute top-3 right-3 bg-[#B88746] text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          Odporúčame
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#B88746]/10 border border-[#B88746]/30 flex items-center justify-center flex-shrink-0">
          <VehicleIcon cls={variant.class} className="w-5 h-5 text-[#B88746]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-semibold text-white truncate">
            {CLASS_LABEL[variant.class]}
          </h3>
          <p className="text-xs text-[#888888] flex items-center gap-1.5 mt-0.5">
            <Users className="w-3.5 h-3.5" />
            do {totalCapacity} pax
            {variant.vehicleCount > 1 && (
              <span className="ml-1 text-[#B88746] font-medium">
                · {variant.vehicleCount}× vozidlo
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl md:text-4xl font-bold text-[#B88746]">
          {formatEur(variant.totalPrice)} €
        </span>
        {variant.vehicleCount > 1 && (
          <span className="text-xs text-[#666]">
            celkom
          </span>
        )}
      </div>
      <p className="text-xs text-[#666666] mt-1">
        {km.toLocaleString("sk-SK")} km · {formatDuration(durationSec)}
        {variant.vehicleCount > 1 && (
          <> · {formatEur(variant.pricePerVehicle)} € / vozidlo</>
        )}
      </p>

      {variant.note && (
        <p className="text-xs text-[#888] mt-2">{variant.note}</p>
      )}

      <div className="mt-4 flex items-center justify-between text-sm font-medium text-[#B88746] group-hover:text-white transition-colors">
        <span>Vybrať a pokračovať</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  )
}
