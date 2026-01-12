import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureCard } from "@/components/feature-card"
import { ContactForm } from "@/components/contact-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import Link from "next/link"
import type { Metadata } from "next"
import { VehicleShowcase } from "@/components/vehicle-showcase"
import Image from "next/image"

export const metadata: Metadata = {
  title: "By The Wave - Krátkodobý a dlhodobý prenájom vozidiel, limousine service a prémiová preprava osôb",
  description:
    "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá, profesionálni vodiči, krátkodobý a dlhodobý prenájom. Executive mobility a limousine service pre náročných klientov.",
  keywords: [
    "prenájom vozidiel Slovensko",
    "luxusné vozidlá prenájom",
    "executive mobility Bratislava",
    "Mercedes prenájom",
    "BMW prenájom",
    "Hyundai Staria prenájom",
    "VIP preprava Slovensko",
    "šofér s vozidlom",
  ],
  openGraph: {
    title: "By The Wave - Krátkodobý a dlhodobý prenájom vozidiel, limousine service a prémiová preprava osôb",
    description:
      "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá, profesionálni vodiči, krátkodobý a dlhodobý prenájom. Executive mobility a limousine service pre náročných klientov.",
    url: "https://btw.sk",
    images: [
      {
        url: "/images/hero-background.png",
        width: 1200,
        height: 630,
        alt: "BY THE WAVE - Executive Mobility",
      },
    ],
  },
  alternates: {
    canonical: "https://btw.sk",
  },
}

export default async function HomePage() {
  // Fetch vehicles for the showcase section
  // const vehicles = await fetchVehicles()
  // const featuredVehicle = vehicles.length > 0 ? vehicles[0] : null

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "BY THE WAVE - Executive Mobility",
            description: "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá, profesionálni vodiči, krátkodobý a dlhodobý prenájom. Executive mobility a limousine service pre náročných klientov.",
            url: "https://btw.sk",
            mainEntity: {
              "@type": "AutoRental",
              name: "BY THE WAVE",
              description: "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá, profesionálni vodiči, krátkodobý a dlhodobý prenájom. Executive mobility a limousine service pre náročných klientov.",
              priceRange: "€€",
              address: {
                "@type": "PostalAddress",
                addressCountry: "SK",
              },
            },
          }),
        }}
      />

      {/* Hero Section - Fixed layout without overlapping content */}
      <section className="relative min-h-screen flex items-center justify-center">
        <video autoPlay muted loop playsInline preload="metadata" poster="/images/hero-poster.webp" className="absolute inset-0 w-full h-full object-cover">
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Main Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-20 mt-[-144px] mr-[auo]">
          <div className="flex justify-end mb-8">
            <p className="text-white text-xl font-medium tracking-wider mb-[37px]">EXECUTIVE MOBILITY</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-12 leading-tight text-right md:mt-[-50px] mt-[127px]">
            Nechajte sa
            <br />
            viesť na vlne
            <br />
            luxusu a komfortu
          </h1>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-[-250px] mt-[68px]">
            <Card className="bg-[#131313] border-[#444444] backdrop-blur-sm mb-6 md:mb-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-white">Prenájom vozidla</h2>
                <p className="text-[#E0E0E0] text-base mb-6 leading-relaxed">
                  Využite služby krátkodobého alebo dlhodobého prenájmu vozidla na súkromné alebo firemné účely.
                </p>
                <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                    Vybrať vozidlo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-[#131313] border-[#444444] backdrop-blur-sm mb-6 md:mb-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-white">Preprava osôb</h2>
                <p className="text-[#E0E0E0] text-base mb-6 leading-relaxed">
                  Rezervujte si odvoz z bodu A do bodu B alebo získajte služby Executive Mobility - privátneho šoféra s
                  vozidlom.
                </p>
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                    Vybrať termín
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-20 px-6 bg-[#111111] relative">
        <div className="max-w-6xl mx-auto mt-[185px]">
          <h2 className="text-4xl font-bold text-center tracking-wide text-white mb-0">NAŠE VOZIDLÁ</h2>

          <div className="relative">
            <VehicleShowcase />


          </div>

          <div className="text-center mt-8">
            <Link href="/nase-vozidla">
              <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                Zobraziť všetky vozidlá
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="relative overflow-hidden flex items-center py-16 md:py-0 md:h-[743px]">
        {/* Full-width background */}
        <div className="absolute inset-0 bg-[url('/images/reservation-bg.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />

        {/* Content aligned with Main Hero */}
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 text-center md:text-right py-4 md:py-0">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Rezervujte si odvoz
            </h2>
            <p className="text-[#CCCCCC] mb-8 max-w-2xl ml-auto text-right">
              Vyberte si miesto a čas odchodu a spoľahnite sa, že tam budeme. Navyše si vyberte kategóriu vozidla a
              užívajte si maximálny komfort.
            </p>
            <Link href="/rezervacie">
              <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white text-lg px-8 py-3">
                Rezervovať odvoz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">PREČO SI NÁS VYBRAŤ</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <FeatureCard
              icon={
                <Image
                  src="/images/comfort-icon.png"
                  alt="Comfort"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              }
              title="Komfort a kvalita"
              description="Ponúkame najvyšší komfort a mobilitu, pre cestovanie v štýle."
            />
            <FeatureCard
              icon={<Image src="/images/time-icon.png" alt="Time" width={32} height={32} className="w-8 h-8" />}
              title="Časová efektívita"
              description="Vždy na čas a pripravení na vašu cestu. Spoľahnite sa na našu presnosť a profesionalitu."
            />
            <FeatureCard
              icon={<Image src="/images/diamond-icon.png" alt="Diamond" width={32} height={32} className="w-8 h-8" />}
              title="Exkluzívne autá"
              description="Naše vozidlá predstavujú špičkovú luxus a prestíž"
            />
            <FeatureCard
              icon={<Image src="/images/money-icon.png" alt="Money" width={32} height={32} className="w-8 h-8" />}
              title="Cena a kvalita"
              description="Sme jedni z najlepších v pomere cena a kvalita"
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/sluzby">
              <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                Zobraziť služby
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  )
}
