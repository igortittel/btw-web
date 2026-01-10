"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Fuel, Users, Car, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import { LightboxGallery } from "@/components/lightbox-gallery"
import { fetchVehicleBySlug, getImageUrl, formatPrice, getVehicleSpecs, type Vehicle } from "@/lib/graphql"

interface VehicleDetailClientProps {
  slug: string
}

// Helper function to safely extract price number from any data type
function extractPriceNumber(price: string | number | null | undefined): string {
  if (!price) return "85"

  // Convert to string first
  const priceStr = String(price)

  // Extract numbers, dots, and commas
  const numericPrice = priceStr.replace(/[^\d.,]/g, "")

  // Return the numeric part or default
  return numericPrice || "85"
}

export function VehicleDetailClient({ slug }: VehicleDetailClientProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVehicle() {
      try {
        setLoading(true)
        console.log("🔄 Loading vehicle for slug:", slug)
        
        const fetchedVehicle = await fetchVehicleBySlug(slug)
        
        if (!fetchedVehicle) {
          setError("Vozidlo nebolo nájdené")
        } else {
          setVehicle(fetchedVehicle)
          setError(null)
        }
      } catch (err) {
        console.error("❌ Error loading vehicle:", err)
        setError("Nepodarilo sa načítať vozidlo")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadVehicle()
    }
  }, [slug])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <ScrollToTop />
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88746] mb-4"></div>
            <p className="text-[#CCCCCC]">Načítavam vozidlo...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <ScrollToTop />
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vozidlo nenájdené</h1>
            <p className="text-[#CCCCCC] mb-6">{error || "Požadované vozidlo neexistuje"}</p>
            <Link href="/nase-vozidla">
              <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white">
                Späť na vozidlá
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const specs = getVehicleSpecs(vehicle)
  const galleryImages = [
    getImageUrl(vehicle.popisVozidla.lightbox1),
    getImageUrl(vehicle.popisVozidla.lightbox2),
    getImageUrl(vehicle.popisVozidla.lightbox3),
  ]

  // Safely extract price for structured data
  const priceForStructuredData = extractPriceNumber(vehicle.popisVozidla.cena)

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Structured Data for Vehicle - Client-side */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: vehicle.title,
            description: vehicle.popisVozidla.popis || `Luxusné vozidlo ${vehicle.title} na prenájom`,
            image: getImageUrl(vehicle.popisVozidla.nahlad),
            offers: {
              "@type": "Offer",
              price: priceForStructuredData,
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: priceForStructuredData,
                priceCurrency: "EUR",
                unitText: "deň",
              },
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "BY THE WAVE",
              },
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Prevodovka",
                value: specs.transmission,
              },
              {
                "@type": "PropertyValue",
                name: "Palivo",
                value: specs.fuel,
              },
              {
                "@type": "PropertyValue",
                name: "Počet miest",
                value: specs.passengers,
              },
              {
                "@type": "PropertyValue",
                name: "Typ vozidla",
                value: specs.type,
              },
            ],
          }),
        }}
      />

      {/* Full Width Gray Background Section */}
      <section className="bg-[#1A1A1A] px-6 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/nase-vozidla" className="flex items-center space-x-2 text-[#CCCCCC] hover:text-white mb-12">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Späť</span>
          </Link>

          {/* Vehicle Details */}
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src={getImageUrl(vehicle.popisVozidla.nahlad) || "/placeholder.svg"}
                alt={`${vehicle.title} - prenájom luxusného vozidla na Slovensku`}
                width={576}
                height={384}
                className="w-full object-contain mb-4"
                priority
              />

              {/* Lightbox Gallery Component */}
              <LightboxGallery images={galleryImages} alt={vehicle.title} thumbnailClassName="h-[120px]" />
            </div>

            <div className="flex flex-col justify-start pt-8">
              <p className="text-[#CCCCCC] text-sm mb-3">Cena už od {formatPrice(vehicle.popisVozidla.cena)}/deň.</p>
              <h1 className="text-3xl font-bold text-white mb-6">{vehicle.popisVozidla.nazov || vehicle.title}</h1>
              <p className="text-[#CCCCCC] text-sm mb-8 leading-relaxed">
                {vehicle.popisVozidla.popis || "Spoznajte novú úroveň mobility. Rezervujte si vozidlo ešte dnes."}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-[#CCCCCC]" />
                  <span className="text-sm text-[#CCCCCC]">{specs.transmission}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Fuel className="w-5 h-5 text-[#CCCCCC]" />
                  <span className="text-sm text-[#CCCCCC]">{specs.fuel}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-[#CCCCCC]" />
                  <span className="text-sm text-[#CCCCCC]">{specs.passengers}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-[#CCCCCC]" />
                  <span className="text-sm text-[#CCCCCC]">{specs.type}</span>
                </div>
              </div>

              {/* Mobile-centered CTA button */}
              <div className="flex justify-center md:justify-start">
                <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-8 py-3 rounded-lg w-fit">
                    Prenajať vozidlo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of content on black background */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Service Cards */}
          <div className="space-y-4 mb-16">
           {/* Vehicle detailed sections (ACF) */}
            <div className="mb-20 space-y-12">

              {/* Motorizácia */}
              {vehicle.popisVozidla?.motorizacia && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Motorizácia
                  </h2>
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: vehicle.popisVozidla.motorizacia }}
                  />
                </div>
              )}

              {/* Komfort */}
              {vehicle.popisVozidla?.komfort && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Komfort
                  </h2>
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: vehicle.popisVozidla.komfort }}
                  />
                </div>
              )}

              {/* Technológie */}
              {vehicle.popisVozidla?.technologie && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Technológie
                  </h2>
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: vehicle.popisVozidla.technologie }}
                  />
                </div>
              )}

              {/* Služby v cene prenájmu */}
              {vehicle.popisVozidla?.sluzbyVCene && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Služby v cene prenájmu
                  </h2>
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: vehicle.popisVozidla.sluzbyVCene }}
                  />
                </div>
              )}

            </div>
            <div className="bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="text-[#B88746] text-2xl flex-shrink-0 mt-1">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">Dlhodobý prenájom vozidla</h3>
                    <ul className="text-[#CCCCCC] text-sm space-y-1">
                      <li>• Prenájom vozidla od minimálne 30 dní</li>
                      <li>• Pravidelný servis a sezónne prezutie v cene</li>
                      <li>• Vozidlá poistené všetkými typmi poistení</li>
                      <li>• Diaľničná známka v cene</li>
                      <li>
                        • Zvýhodnená cena ďalších služieb (krátkodobý prenájom, preprava osôb, Executive mobility)
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col items-stretch md:items-end space-y-2 md:flex-shrink-0 md:ml-6">
                  <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg text-sm w-full md:w-auto">
                      Prenajať vozidlo
                    </Button>
                  </Link>
                  <Link href="/prenajom-vozidiel">
                    <button className="text-[#CCCCCC] hover:text-white underline text-xs text-center w-full">
                      Podmienky prenájmu
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="text-[#B88746] text-2xl flex-shrink-0 mt-1">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">Krátkodobý prenájom vozidla</h3>
                    <ul className="text-[#CCCCCC] text-sm space-y-1">
                      <li>• Prenájom vozidla od 1 dňa</li>
                      <li>• Pravidelný servis a sezónne prezutie v cene</li>
                      <li>• Vozidlá poistené všetkými typmi poistení</li>
                      <li>• Diaľničná známka v cene</li>
                      <li>• Zvýhodnená cena prepravy osôb</li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col items-stretch md:items-end space-y-2 md:flex-shrink-0 md:ml-6">
                  <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg text-sm w-full md:w-auto">
                      Prenajať vozidlo
                    </Button>
                  </Link>
                  <Link href="/prenajom-vozidiel">
                    <button className="text-[#CCCCCC] hover:text-white underline text-xs text-center w-full">
                      Podmienky prenájmu
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <Image
                      src="/images/service-diamond-icon.png"
                      alt="Executive mobility"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">Executive mobility</h3>
                    <ul className="text-[#CCCCCC] text-sm space-y-1">
                      <li>• Exkluzívna služba na mieru</li>
                      <li>• Osobný šofér aj s vozidlom</li>
                      <li>• Podmienky a rozsah služieb je prispôsobený klientovi</li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col items-stretch md:items-end space-y-2 md:flex-shrink-0 md:ml-6">
                  <Link href="/kontakt">
                    <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg text-sm w-full md:w-auto">
                      Mám záujem
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  )
}
