import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureCard } from "@/components/feature-card"
import { ContactForm } from "@/components/contact-form"
import { ServiceCard } from "@/components/service-card"
import { ScrollToTop } from "@/components/scroll-to-top"
import Link from "next/link"
import type { Metadata } from "next"
import { VehicleShowcase } from "@/components/vehicle-showcase"
import Image from "next/image"
import { Reveal } from "@/components/Reveal"

export const metadata: Metadata = {
  title: "Naše služby - Prenájom vozidiel a preprava osôb",
  description:
    "Kompletné služby prenájmu vozidiel na Slovensku: krátkodobý a dlhodobý prenájom, preprava osôb s profesionálnym šoférom, Executive Mobility. Mercedes, BMW, Hyundai Staria.",
  keywords: [
    "služby prenájmu vozidiel",
    "krátkodobý prenájom Slovensko",
    "dlhodobý prenájom vozidiel",
    "preprava osôb Bratislava",
    "executive mobility služby",
    "profesionálny šofér",
    "VIP preprava Slovensko",
  ],
  openGraph: {
    title: "Naše služby - Prenájom vozidiel a preprava osôb | BY THE WAVE",
    description:
      "Kompletné služby prenájmu vozidiel a prepravy osôb na Slovensku. Profesionálne služby mobility pre náročných klientov.",
    url: "https://bythewave.sk/sluzby",
  },
  alternates: {
    canonical: "https://bythewave.sk/sluzby",
  },
}

export default function SluzbyPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Structured Data for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Prenájom vozidiel a preprava osôb",
            description: "Kompletné služby prenájmu luxusných vozidiel a VIP prepravy na Slovensku",
            provider: {
              "@type": "Organization",
              name: "BY THE WAVE",
            },
            areaServed: {
              "@type": "Country",
              name: "Slovakia",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Vehicle Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Krátkodobý prenájom vozidiel",
                    description: "Prenájom luxusných vozidiel od 1 dňa",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Dlhodobý prenájom vozidiel",
                    description: "Prenájom vozidiel od 30 dní",
                  },
                },
              ],
            },
          }),
        }}
      />

      {/* Services Section */}
      <section className="py-20 px-6 pt-32 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <Reveal y={32}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
                Pozrite si ponuku
                <span className="block text-[#B88746]">našich služieb</span>
              </h1>
            </Reveal>
          </div>
          <div className="space-y-6">
            <Reveal>
              <ServiceCard
                icon={
                  <Image src="/images/service-bus-icon.png" alt="Bus" width={24} height={24} className="w-full h-6" />
                }
                title="Dlhodobý prenájom vozidiel"
                features={[
                  "Prenájom vozidla od minimálne 30 dní",
                  "Pravidelný servis a sezónne prezutie v cene",
                  "Poistenie vozidla v cene",
                  "Diaľničná známka v cene",
                  "Vhodné pre služobné cesty (krátkodobý prenájom, preprava osôb, Executive mobility)",
                ]}
                description=""
                buttonText="Vybrať vozidlo"
                buttonLink="/prenajom-vozidiel"
              />
            </Reveal>

            <Reveal delay={0.08}>
              <ServiceCard
                icon={
                  <Image
                    src="/images/service-bus-plus-icon.png"
                    alt="Bus Plus"
                    width={24}
                    height={24}
                    className="w-full h-6"
                  />
                }
                title="Krátkodobý prenájom vozidiel"
                features={[
                  "Prenájom vozidla od 1 dňa",
                  "Pravidelný servis a sezónne prezutie v cene",
                  "Vozidlá poistené všetkými typmi poistení",
                  "Diaľničná známka v cene",
                  "Vhodné pre služobné cesty",
                ]}
                description=""
                buttonText="Vybrať vozidlo"
                buttonLink="/prenajom-vozidiel"
              />
            </Reveal>

            <Reveal delay={0.16}>
              <ServiceCard
                icon={
                  <Image
                    src="/images/service-person-icon.png"
                    alt="Person"
                    width={24}
                    height={24}
                    className="w-full h-6"
                  />
                }
                title="Preprava osôb"
                features={[
                  "Spoľahlivá preprava osôb v rámci EÚ",
                  "Rezervácia min. 24 hodín pred odchodom",
                  "Profesionálni vodiči (Business Class, Van)",
                  "Profesionálni a skúsení vodiči",
                  "Individuálny prístup k zákazníkom",
                ]}
                description=""
                buttonText="Vybrať termín"
                buttonLink="/preprava-osob"
              />
            </Reveal>

            <Reveal delay={0.24}>
              <ServiceCard
                icon={
                  <Image
                    src="/images/service-diamond-icon.png"
                    alt="Diamond"
                    width={32}
                    height={32}
                    className="w-full h-8"
                  />
                }
                title="Executive mobility"
                features={[
                  "Exkluzívna služba na mieru",
                  "Osobný šofér aj s vozidlom",
                  "Podmienky a rozsah služieb je prispôsobený klientovi",
                ]}
                description=""
                buttonText="Mám záujem"
                buttonLink=""
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-20 px-6 bg-[#1D1D1D] relative">
        <div className="max-w-6xl mx-auto">
          <Reveal y={24}>
            <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">NAŠE VOZIDLÁ</h2>
          </Reveal>

          <div className="relative">
            <VehicleShowcase />

          </div>

          <div className="text-center mt-8">
            <Reveal delay={0.12}>
              <Link href="/nase-vozidla">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                  Zobraziť všetky vozidlá
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Reveal>
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
            <Reveal delay={0.06}>
              <FeatureCard
                icon={<Image src="/images/time-icon.svg" alt="Time" width={32} height={32} className="w-8 h-8" />}
                title="Časová efektívita"
                description="Vždy na čas a pripravení na vašu cestu. Spoľahnite sa na našu presnosť a profesionalitu."
              />
            </Reveal>
            <Reveal delay={0.12}>
              <FeatureCard
                icon={<Image src="/images/diamond-icon.svg" alt="Diamond" width={32} height={32} className="w-8 h-8" />}
                title="Exkluzívne autá"
                description="Naše vozidlá predstavujú špičkovú luxus a prestíž"
              />
            </Reveal>
            <Reveal delay={0.18}>
              <FeatureCard
                icon={<Image src="/images/money-icon.svg" alt="Money" width={32} height={32} className="w-8 h-8" />}
                title="Cena a kvalita"
                description="Sme jedni z najlepších v pomere cena a kvalita"
              />
            </Reveal>
          </div>

          <div className="text-center mt-12">
            <Reveal delay={0.12}>
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
