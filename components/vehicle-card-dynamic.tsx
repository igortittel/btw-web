import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cog, Fuel, User, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type Vehicle, getImageUrl, getVehicleSpecs, getTransferCategory } from "@/lib/graphql"

interface VehicleCardDynamicProps {
  vehicle: Vehicle
  primaryButton?: string
  secondaryButton?: string
  showTransferButton?: boolean
}

export function VehicleCardDynamic({
  vehicle,
  primaryButton = "Prenajať vozidlo",
  secondaryButton = "Zobraziť vozidlo",
  showTransferButton = false,
}: VehicleCardDynamicProps) {
  const specs = getVehicleSpecs(vehicle)

  const firstVal = (v: unknown): string | undefined => {
    if (!v) return undefined
    if (Array.isArray(v)) {
      const x = v.find(Boolean)
      return typeof x === "string" ? x : x != null ? String(x) : undefined
    }
    return typeof v === "string" ? v : String(v)
  }

  const pick = (...vals: unknown[]): string | undefined => {
    for (const v of vals) {
      const s = firstVal(v)
      if (s && s.trim()) return s.trim()
    }
    return undefined
  }

  const pickNumber = (...vals: unknown[]): number | undefined => {
    for (const v of vals) {
      if (typeof v === "number" && Number.isFinite(v)) return v
      if (typeof v === "string" && v.trim()) {
        const n = parseInt(v, 10)
        if (Number.isFinite(n)) return n
      }
    }
    return undefined
  }

  const transmissionLabel = pick(
    (vehicle as any).prevodovka,
    (vehicle as any).popisVozidla?.prevodovka,
    (specs as any).transmission,
    (specs as any).transmissionLabel,
  )

  const fuelLabel = pick(
    (vehicle as any).palivo,
    (vehicle as any).popisVozidla?.palivo,
    (specs as any).fuel,
    (specs as any).fuelLabel,
  )

  const categoryLabel = pick(
    (vehicle as any).kategoria,
    (vehicle as any).popisVozidla?.kategoria,
    (specs as any).category,
    (specs as any).categoryLabel,
  )

  const passengersCount = pickNumber(
    (vehicle as any).osoby,
    (vehicle as any).popisVozidla?.osoby,
    (specs as any).passengers,
  )
  const interiorImages = [
    getImageUrl(vehicle.popisVozidla.lightbox1),
    getImageUrl(vehicle.popisVozidla.lightbox2),
    getImageUrl(vehicle.popisVozidla.lightbox3),
  ]

  const formatText = (text: string | undefined | null): string => {
    if (!text || typeof text !== "string") return ""
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  if (showTransferButton) {
    // Transfer vehicle card layout
    return (
      <Card className="bg-[#1A1A1A] border-[#333333] overflow-hidden rounded-xl hover:border-[#444444] transition-colors mb-6">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <p className="text-[#CCCCCC] text-sm mb-3">Kategória</p>
            <h3 className="text-xl font-bold text-white mb-10">{categoryLabel ?? getTransferCategory(vehicle)}</h3>

            <div className="mb-10">
              <Image
                src={getImageUrl(vehicle.popisVozidla.nahlad) || "/placeholder.svg"}
                alt={vehicle.title}
                width={300}
                height={180}
                className="mx-auto object-contain"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Car className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">{vehicle.popisVozidla.nazov || vehicle.title}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-[#CCCCCC]" />
                <span className="text-sm text-[#CCCCCC]">max. {passengersCount ?? specs.passengers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-[#CCCCCC]" />
                <span className="text-sm text-[#CCCCCC]">max. {pickNumber((vehicle as any).batozina, (vehicle as any).popisVozidla?.batozina, (specs as any).luggage) ?? (specs as any).luggage}</span>
              </div>
            </div>
          </div>

          <Link href="/rezervacie">
            <Button className="w-full bg-[#B88746] hover:bg-[#A67C52] text-white font-medium py-3 rounded-lg">
              Rezervovať
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Regular vehicle card layout
  return (
    <Card className="bg-[#1A1A1A] border-[#333333] overflow-hidden rounded-xl hover:border-[#444444] transition-colors">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <Image
            src={getImageUrl(vehicle.popisVozidla.nahlad) || "/placeholder.svg"}
            alt={vehicle.title}
            width={200}
            height={120}
            className="mx-auto object-contain mb-6"
          />

          <div className="flex justify-center gap-2 mb-8">
            {interiorImages.slice(0, 3).map((img, index) => (
              <Image
                key={index}
                src={img || "/placeholder.svg"}
                alt={`Interior ${index + 1}`}
                width={45}
                height={35}
                className="rounded-lg object-cover"
                style={{ borderRadius: "8px" }}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">{vehicle.popisVozidla.nazov || vehicle.title}</h3>
          <p className="text-[#CCCCCC] text-sm mb-8">
            Cena od: {Number(vehicle.popisVozidla.cena || 0).toFixed(2)} € / deň
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8 text-left">
            <div className="flex items-center space-x-2">
              <Cog className="w-4 h-4 text-[#B88746]" />
              <span className="text-sm text-[#CCCCCC]">
                {transmissionLabel ? formatText(transmissionLabel) : "Automat"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-[#B88746]" />
              <span className="text-sm text-[#CCCCCC]">
                {fuelLabel ? formatText(fuelLabel) : "Benzín"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-[#B88746]" />
              <span className="text-sm text-[#CCCCCC]">{passengersCount ? `${passengersCount} osôb` : "—"}</span>
            </div>
            <div className="flex items-start gap-2">
              <Car className="w-4 h-4 text-[#B88746] shrink-0 mt-0.5" />
              <span
                className="text-[13px] text-[#CCCCCC] leading-tight whitespace-nowrap"
                title={categoryLabel ?? "Business Van"}
              >
                {categoryLabel ?? "Business Van"}
              </span>
            </div>
          </div>

          <div className="space-y-10">
            <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-[#B88746] hover:bg-[#A67C52] text-white font-medium py-3 rounded-lg">
                {primaryButton}
              </Button>
            </Link>
            {secondaryButton && (
              <Link href={`/nase-vozidla/${vehicle.slug}`}>
                <button className="w-full text-[#CCCCCC] hover:text-white underline text-sm">{secondaryButton}</button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
