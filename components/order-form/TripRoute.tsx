"use client"

import { CalendarDays, Clock, MapPin, Repeat, Users } from "lucide-react"
import type { TripState, PlaceValue } from "./useOrderForm"

/** "2026-11-14" → "so 14. 11. 2026" */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const weekday = new Intl.DateTimeFormat("sk-SK", { weekday: "short" }).format(d)
  return `${weekday} ${Number(m[3])}. ${Number(m[2])}. ${m[1]}`
}

function splitAddress(address: string): { main: string; rest: string } {
  const [main, ...rest] = address.split(",")
  return { main: main.trim(), rest: rest.join(",").trim() }
}

type Stop = { kind: "from" | "via" | "to"; label: string; place: PlaceValue }

function Stops({ stops }: { stops: Stop[] }) {
  return (
    <ol className="relative">
      {stops.map((s, i) => {
        const { main, rest } = splitAddress(s.place.address)
        const last = i === stops.length - 1
        return (
          <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
            {/* connector line */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute left-[11px] top-6 bottom-0 w-px bg-[#B88746]/40"
              />
            )}
            <span aria-hidden="true" className="relative z-10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center">
              {s.kind === "to" ? (
                <MapPin className="h-6 w-6 text-[#B88746]" fill="#B88746" stroke="#0f0f0f" />
              ) : s.kind === "from" ? (
                <span className="h-4 w-4 rounded-full border-[3px] border-[#B88746] bg-[#0f0f0f]" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-[#B88746]" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                {s.label}
              </p>
              <p className="text-white font-medium leading-snug break-words">{main || "—"}</p>
              {rest && <p className="text-sm text-[#888] leading-snug break-words">{rest}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a] bg-[#161616] px-3 py-1.5 text-sm text-white">
      <span className="text-[#B88746]">{icon}</span>
      {children}
    </span>
  )
}

/** Clear, scannable trip overview: where from, where to, stops, date & time. */
export function TripRoute({ trip }: { trip: TripState }) {
  const stops: Stop[] = [
    { kind: "from", label: "Odkiaľ", place: trip.pickup },
    ...trip.waypoints.map((w, i) => ({
      kind: "via" as const,
      label: trip.waypoints.length > 1 ? `Medzizastávka ${i + 1}` : "Medzizastávka",
      place: w,
    })),
    { kind: "to", label: "Kam", place: trip.destination },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip icon={<CalendarDays className="h-4 w-4" />}>{formatDate(trip.date)}</Chip>
        <Chip icon={<Clock className="h-4 w-4" />}>{trip.time}</Chip>
        <Chip icon={<Users className="h-4 w-4" />}>{trip.pax} os.</Chip>
      </div>

      <Stops stops={stops} />

      {trip.isReturnTrip && (
        <div className="flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#161616] p-3 text-sm">
          <Repeat className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B88746]" />
          <div>
            <p className="font-medium text-white">Spiatočná cesta</p>
            <p className="text-[#888]">
              {formatDate(trip.returnDate)} o {trip.returnTime} · {splitAddress(trip.destination.address).main} →{" "}
              {splitAddress(trip.pickup.address).main}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
