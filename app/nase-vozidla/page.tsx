"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleCardDynamic } from "@/components/vehicle-card-dynamic"
import { FeatureCard } from "@/components/feature-card"
import { ContactForm } from "@/components/contact-form"
import Image from "next/image"
import { ScrollToTop } from "@/components/scroll-to-top"
import { fetchVehicles, type Vehicle, isRentalVehicle, isTransferVehicle } from "@/lib/graphql"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Reveal } from "@/components/Reveal"

export default function NaseVozidlaPage() {
  const [activeTab, setActiveTab] = useState<"prenajom" | "transfer">("prenajom")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true)
        console.log("🔄 Starting to load vehicles...")

        const fetchedVehicles = await fetchVehicles()
        console.log("🚗 Raw vehicles loaded:", fetchedVehicles.length)

        if (fetchedVehicles.length === 0) {
          console.warn("⚠️ No vehicles returned from API")
          setError("Žiadne vozidlá neboli načítané z API")
        } else {
          console.log("✅ Vehicles loaded successfully")
          setVehicles(fetchedVehicles)
          setError(null)
        }

        // Test filtering immediately after loading
        console.log("🧪 Testing filters...")
        const testRental = fetchedVehicles.filter(isRentalVehicle)
        const testTransfer = fetchedVehicles.filter(isTransferVehicle)

        console.log(`📊 Filter test results:`)
        console.log(`   - Rental vehicles: ${testRental.length}`)
        console.log(`   - Transfer vehicles: ${testTransfer.length}`)

        testRental.forEach((v) => console.log(`   📝 Rental: ${v.title}`))
        testTransfer.forEach((v) => console.log(`   🚐 Transfer: ${v.title}`))
      } catch (err) {
        console.error("❌ Error loading vehicles:", err)
        setError("Nepodarilo sa načítať vozidlá. Skúste to prosím znovu.")
      } finally {
        setLoading(false)
        console.log("🏁 Loading finished")
      }
    }

    loadVehicles()
  }, [])

  // --- Price sorting helpers (lowest price first) ---
  const getPriceNumber = (v: Vehicle) => {
    const raw = v?.popisVozidla?.cena
    if (!raw) return Number.POSITIVE_INFINITY

    // Extract first number from strings like "85 €", "od 120 €/deň", "120 EUR", etc.
    const digits = String(raw).match(/\d+/g)
    if (!digits || digits.length === 0) return Number.POSITIVE_INFINITY

    return Number(digits.join("")) || Number.POSITIVE_INFINITY
  }

  const sortByPriceAsc = (list: Vehicle[]) =>
    [...list].sort((a, b) => getPriceNumber(a) - getPriceNumber(b))

  // Filter vehicles by category using helper functions + sort by price
  const rentalVehicles = sortByPriceAsc(vehicles.filter(isRentalVehicle))
  const transferVehicles = sortByPriceAsc(vehicles.filter(isTransferVehicle))

  console.log("📊 Filtering results:")
  console.log(`🚗 Total vehicles: ${vehicles.length}`)
  console.log(`🚗 Rental vehicles: ${rentalVehicles.length}`)
  console.log(`🚐 Transfer vehicles: ${transferVehicles.length}`)

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Vehicles Section */}
      <section className="py-20 px-6 pt-32 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <Reveal y={16} delay={0.02}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white text-center mb-8">
              Naše vozidlá
              <span className="block text-[#B88746]">na prenájom a transfer</span>
            </h1>
          </Reveal>

          {/* Filter Buttons */}
          <Reveal y={16} delay={0.08}>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-12 items-center">
              <Button
                onClick={() => setActiveTab("prenajom")}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === "prenajom"
                    ? "bg-white text-black hover:bg-gray-100"
                    : "border border-[#666666] text-[#CCCCCC] hover:bg-[#333333] hover:text-white bg-transparent"
                }`}
              >
                Vozidlá na prenájom ({rentalVehicles.length})
              </Button>
              <Button
                onClick={() => setActiveTab("transfer")}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === "transfer"
                    ? "bg-white text-black hover:bg-gray-100"
                    : "border border-[#666666] text-[#CCCCCC] hover:bg-[#333333] hover:text-white bg-transparent"
                }`}
              >
                Vozidlá na transfer ({transferVehicles.length})
              </Button>
            </div>
          </Reveal>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88746]"></div>
              <p className="text-[#CCCCCC] mt-4">Načítavam vozidlá...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#B88746] hover:bg-[#A67C52] text-black">
                Skúsiť znovu
              </Button>
            </div>
          )}

          {/* Vehicle Grid */}
          {!loading && !error && (
            <>
              {activeTab === "prenajom" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentalVehicles.length > 0 ? (
                    rentalVehicles.map((vehicle, index) => (
                      <Reveal key={`${vehicle.slug}-${index}`} y={16} delay={0.06 + index * 0.03}>
                        <div
                          role="link"
                          tabIndex={0}
                          className="cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.015] focus:scale-[1.015]"
                          onClick={(e) => {
                            const target = e.target as HTMLElement
                            if (target.closest("a,button")) return
                            router.push(`/nase-vozidla/${vehicle.slug}`)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              router.push(`/nase-vozidla/${vehicle.slug}`)
                            }
                          }}
                        >
                          <VehicleCardDynamic
                            vehicle={vehicle}
                            primaryButton="Prenajať vozidlo"
                            secondaryButton="Zobraziť vozidlo"
                          />
                        </div>
                      </Reveal>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-[#CCCCCC]">Momentálne nemáme k dispozícii žiadne vozidlá na prenájom.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transferVehicles.length > 0 ? (
                    transferVehicles.map((vehicle, index) => (
                      <Reveal key={`${vehicle.slug}-${index}`} y={16} delay={0.06 + index * 0.03}>
                        <VehicleCardDynamic vehicle={vehicle} showTransferButton={true} />
                      </Reveal>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-[#CCCCCC]">Momentálne nemáme k dispozícii žiadne vozidlá na transfer.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <Reveal y={16} delay={0.02}>
            <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">PREČO SI NÁS VYBRAŤ</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <Reveal y={16} delay={0.06}>
              <FeatureCard
                icon={
                  <Image
                    src="/images/comfort-icon.svg"
                    alt="Comfort"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                }
                title="Komfort a kvalita"
                description="Ponúkame najvyšší komfort a mobilitu, pre cestovanie v štýle."
              />
            </Reveal>
            <Reveal y={16} delay={0.1}>
              <FeatureCard
                icon={<Image src="/images/time-icon.svg" alt="Time" width={32} height={32} className="w-8 h-8" />}
                title="Časová efektívita"
                description="Vždy na čas a pripravení na vašu cestu. Spoľahnite sa na našu presnosť a profesionalitu."
              />
            </Reveal>
            <Reveal y={16} delay={0.14}>
              <FeatureCard
                icon={<Image src="/images/diamond-icon.svg" alt="Diamond" width={32} height={32} className="w-8 h-8" />}
                title="Exkluzívne autá"
                description="Naše vozidlá predstavujú špičkovú luxus a prestíž"
              />
            </Reveal>
            <Reveal y={16} delay={0.18}>
              <FeatureCard
                icon={<Image src="/images/money-icon.svg" alt="Money" width={32} height={32} className="w-8 h-8" />}
                title="Cena a kvalita"
                description="Sme jedni z najlepších v pomere cena a kvalita"
              />
            </Reveal>
          </div>

          <Reveal y={16} delay={0.24}>
            <div className="text-center mt-12">
              <Link href="/sluzby" className="inline-flex">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                  Zobraziť služby
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  )
}
