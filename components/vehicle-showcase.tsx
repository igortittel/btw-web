"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Cog, User, Fuel, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchVehicles, getImageUrl, getVehicleSpecs, isRentalVehicle, type Vehicle } from "@/lib/graphql"

export function VehicleShowcase() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  useEffect(() => {
    async function loadVehicles() {
      try {
        const fetchedVehicles = await fetchVehicles()
        const rentalVehicles = fetchedVehicles.filter(isRentalVehicle)
        console.log("🎠 Rental vehicles loaded for showcase:", rentalVehicles.length)
        setVehicles(rentalVehicles)
      } catch (error) {
        console.error("Error loading vehicles for showcase:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  const nextVehicle = () => {
    setCurrentIndex((prev) => (prev + 1) % vehicles.length)
  }

  const prevVehicle = () => {
    setCurrentIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && vehicles.length > 1) {
      nextVehicle()
    }
    if (isRightSwipe && vehicles.length > 1) {
      prevVehicle()
    }
  }

  if (loading) {
    return (
      <div className="relative">
        <Card className="bg-[#111111] border-[#666666] overflow-hidden rounded-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-72 md:h-96 flex items-center justify-center p-4 md:p-8 bg-[#111111]">
                <div className="animate-pulse bg-[#333333] w-full h-full rounded"></div>
              </div>
              <div className="p-4 md:p-8 flex flex-col justify-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-[#333333] rounded w-1/3"></div>
                  <div className="h-8 bg-[#333333] rounded w-2/3"></div>
                  <div className="h-4 bg-[#333333] rounded w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-[#333333] rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="relative">
        <Card className="bg-[#111111] border-[#666666] overflow-hidden rounded-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-72 md:h-96 flex items-center justify-center p-4 md:p-8 bg-[#111111]">
                <Image
                  src="/images/hyundai-staria-clean.png"
                  alt="Luxusné vozidlo - prenájom"
                  width={810}
                  height={540}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <div className="p-4 md:p-8 flex flex-col justify-center">
                <p className="text-[#CCCCCC] text-sm mb-2">Cena od: 85.00 € / deň</p>
                <h3 className="text-2xl font-bold mb-2 text-white">Hyundai Staria</h3>
                <h4 className="text-xl font-bold mb-4 text-white">Luxury 4x4</h4>
                <p className="text-[#CCCCCC] mb-6 text-sm">
                  Spoznajte novú úroveň mobility. Rezervujte si vozidlo ešte dnes.
                </p>
                <div className="flex space-x-4">
                  <Link href="/nase-vozidla">
                    <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                      Prenajať vozidlo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentVehicle = vehicles[currentIndex]

  // Safety check for current vehicle
  if (!currentVehicle || !currentVehicle.popisVozidla) {
    console.error("❌ Invalid vehicle data:", currentVehicle)
    return (
      <div className="relative">
        <Card className="bg-[#111111] border-[#666666] overflow-hidden rounded-lg">
          <CardContent className="p-8 text-center">
            <p className="text-[#CCCCCC]">Chyba pri načítaní vozidla</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const specs = getVehicleSpecs(currentVehicle)

  return (
    <div className="relative mt-7">
      <Card
        ref={cardRef}
        className="bg-[#111111] border-[#666666] overflow-hidden rounded-lg"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0 min-h-[520px] md:min-h-[420px]">
            <div className="relative h-72 md:h-96 flex items-center justify-center p-4 md:p-8 bg-[#111111]">
              <Link
                href={`/nase-vozidla/${currentVehicle.slug}`}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src={getImageUrl(currentVehicle.popisVozidla.nahlad) || "/placeholder.svg"}
                  alt={`${currentVehicle.title} - prenájom luxusného vozidla`}
                  width={810}
                  height={540}
                  className="object-contain max-w-full max-h-full"
                />
              </Link>
            </div>
            <div className="p-4 md:p-8 flex flex-col justify-center min-h-[260px] md:min-h-[320px] text-center md:text-left">
              <p className="text-[#CCCCCC] text-sm mb-2 text-center md:text-left">
                Cena od: {Number.parseFloat(currentVehicle.popisVozidla.cena || "0").toFixed(2)} € / deň
              </p>
              <h3 className="text-2xl font-bold mb-2 text-white text-center md:text-left">
                {currentVehicle.popisVozidla.nazov || currentVehicle.title}
              </h3>
              <p className="text-[#CCCCCC] mb-6 text-sm text-center md:text-left">
                {currentVehicle.popisVozidla.popis ||
                  "Spoznajte novú úroveň mobility. Rezervujte si vozidlo ešte dnes."}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6 justify-items-center md:justify-items-start">
                <div className="flex items-center space-x-2">
                  <Cog className="w-4 h-4 text-[#B88746]" />
                  <span className="text-sm text-[#CCCCCC]">
                    {currentVehicle.popisVozidla.prevodovka &&
                    Array.isArray(currentVehicle.popisVozidla.prevodovka) &&
                    currentVehicle.popisVozidla.prevodovka.length > 0
                      ? currentVehicle.popisVozidla.prevodovka[0] === "automat"
                        ? "Automat"
                        : currentVehicle.popisVozidla.prevodovka[0] === "manuál" ||
                            currentVehicle.popisVozidla.prevodovka[0] === "manual"
                          ? "Manuál"
                          : currentVehicle.popisVozidla.prevodovka[0].charAt(0).toUpperCase() +
                            currentVehicle.popisVozidla.prevodovka[0].slice(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-[#B88746]" />
                  <span className="text-sm text-[#CCCCCC]">
                    {currentVehicle.popisVozidla.palivo &&
                    Array.isArray(currentVehicle.popisVozidla.palivo) &&
                    currentVehicle.popisVozidla.palivo.length > 0
                      ? currentVehicle.popisVozidla.palivo[0] === "benzin" ||
                        currentVehicle.popisVozidla.palivo[0] === "petrol"
                        ? "Benzín"
                        : currentVehicle.popisVozidla.palivo[0] === "diesel"
                          ? "Diesel"
                          : currentVehicle.popisVozidla.palivo[0].charAt(0).toUpperCase() +
                            currentVehicle.popisVozidla.palivo[0].slice(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#B88746]" />
                  <span className="text-sm text-[#CCCCCC]">{currentVehicle.popisVozidla.osoby || 0} osôb</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-[#B88746]" />
                  <span className="text-sm text-[#CCCCCC]">{currentVehicle.popisVozidla.kategoria || "N/A"}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mt-auto items-center md:items-start">
                <Link href={`/nase-vozidla/${currentVehicle.slug}`}>
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg w-full">
                    Zobzraziť vozidlo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation arrows - hidden on mobile, visible on desktop */}
      {vehicles.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevVehicle}
            className="absolute left-[-18px] md:left-2 top-[32%] md:top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border border-[#666666] text-white w-10 h-10 md:w-12 md:h-12 rounded-full z-10 flex"
            aria-label="Predchádzajúce vozidlo"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextVehicle}
            className="absolute right-[-18px] md:right-2 top-[32%] md:top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border border-[#666666] text-white w-10 h-10 md:w-12 md:h-12 rounded-full z-10 flex"
            aria-label="Nasledujúce vozidlo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {vehicles.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {vehicles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-[#B88746]" : "bg-[#666666]"
              }`}
              aria-label={`Prejsť na vozidlo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
