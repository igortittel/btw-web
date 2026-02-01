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
import { Reveal } from "@/components/Reveal"

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
            <Reveal y={16}>
              <p className="text-white text-xl font-medium tracking-wider mb-[37px]">EXECUTIVE MOBILITY</p>
            </Reveal>
          </div>
          <Reveal y={32} delay={0.06}>
            <h1 className="text-5xl md:text-7xl font-bold mb-12 leading-tight text-right md:mt-[-50px] mt-[127px]">
              Nechajte sa
              <br />
              viesť na vlne
              <br />
              luxusu a komfortu
            </h1>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-[-250px] mt-[68px]">
            <Reveal delay={0.10} y={24}>
              <Card className="bg-[#131313] border-[#444444] backdrop-blur-sm mb-6 md:mb-0 h-full">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Prenájom vozidla</h2>
                  <p className="text-[#E0E0E0] text-base mb-6 leading-relaxed">
                    Využite služby krátkodobého alebo dlhodobého prenájmu vozidla na súkromné alebo firemné účely.
                  </p>
                  <div className="mt-auto">
                    <Link href="/nase-vozidla">
                      <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                        Vybrať vozidlo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.18} y={24}>
              <Card className="bg-[#131313] border-[#444444] backdrop-blur-sm mb-6 md:mb-0 h-full">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Preprava osôb</h2>
                  <p className="text-[#E0E0E0] text-base mb-6 leading-relaxed">
                    Rezervujte si odvoz z bodu A do bodu B alebo získajte služby Executive Mobility - privátneho šoféra s
                    vozidlom.
                  </p>
                  <div className="mt-auto">
                    <Link href="/rezervacie">
                      <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                        Vybrať termín
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-20 px-6 bg-[#111111] relative">
        <div className="max-w-6xl mx-auto mt-[185px] md:mt-[30px]">
          <Reveal y={24}>
            <h2 className="text-4xl font-bold text-center tracking-wide text-white mb-0">NAŠE VOZIDLÁ</h2>
          </Reveal>

          <div className="relative">
            <Reveal y={32} delay={0.08}>
              <VehicleShowcase />
            </Reveal>
          </div>

          <div className="text-center mt-8">
            <Reveal delay={0.12} y={16}>
              <Link href="/nase-vozidla">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                  Zobraziť všetky vozidlá
                </Button>
              </Link>
            </Reveal>
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
            <Reveal y={32}>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Rezervujte si odvoz
              </h2>
            </Reveal>
            <Reveal delay={0.08} y={24}>
              <p className="text-[#CCCCCC] mb-8 max-w-2xl ml-auto text-right">
                Vyberte si miesto a čas odchodu a spoľahnite sa, že tam budeme. Navyše si vyberte kategóriu vozidla a
                užívajte si maximálny komfort.
              </p>
            </Reveal>
            <Reveal delay={0.12} y={16}>
              <Link href="/rezervacie">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white text-lg px-8 py-3">
                  Rezervovať odvoz
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <Reveal y={24}>
            <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">PREČO SI NÁS VYBRAŤ</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 items-stretch">
            <Reveal>
              <div className="h-full">
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
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="h-full">
                <FeatureCard
                  icon={<Image src="/images/time-icon.png" alt="Time" width={32} height={32} className="w-8 h-8" />}
                  title="Časová efektívita"
                  description="Vždy na čas a pripravení na vašu cestu. Spoľahnite sa na našu presnosť a profesionalitu."
                />
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="h-full">
                <FeatureCard
                  icon={<Image src="/images/diamond-icon.png" alt="Diamond" width={32} height={32} className="w-8 h-8" />}
                  title="Exkluzívne autá"
                  description="Naše vozidlá predstavujú špičkovú luxus a prestíž"
                />
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="h-full">
                <FeatureCard
                  icon={<Image src="/images/money-icon.png" alt="Money" width={32} height={32} className="w-8 h-8" />}
                  title="Cena a kvalita"
                  description="Sme jedni z najlepších v pomere cena a kvalita"
                />
              </div>
            </Reveal>
          </div>

          <div className="text-center mt-12">
            <Reveal delay={0.12} y={16}>
              <Link href="/sluzby">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                  Zobraziť služby
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  )
}
