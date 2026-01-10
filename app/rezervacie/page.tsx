import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureCard } from "@/components/feature-card"
import { ContactForm } from "@/components/contact-form"
import { ReservationForm } from "@/components/reservation-form"
import { ServiceCard } from "@/components/service-card"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ExpandableSection } from "@/components/expandable-section"
import Link from "next/link"
import type { Metadata } from "next"
import { VehicleShowcase } from "@/components/vehicle-showcase"
import Image from "next/image"


export const metadata: Metadata = {
  title: "Preprava osôb po celom Slovensku a do okolitých krajín", 
  description:
    "Luxusná preprava osôb po Slovensku a do okolitých krajín. Letiskové transfery, individuálne jazdy a profesionálni šoféri. By The Wave - pohodlie bez kompromisov.",
  keywords: [
      "preprava osôb Slovensko",
      "preprava osôb do zahraničia",
      "medzinárodná preprava osôb",
      "letiskový transfer Bratislava",
      "letiskový transfer Viedeň",
      "transfer na letisko Budapešť",
      "transfer na letisko Praha",
      "súkromná preprava osôb",
      "komfotná preprava osôb",
      "luxusná preprava osôb",
      "šofér na objednávku",
      "profesionálny šofér Slovensko",
      "VIP preprava Slovensko",
      "business transfer služby",
      "doprava na mieru Slovensko",
      "door to door preprava",
      "bezpečná osobná doprava",
      "executive transfer služby",
      "airport transfer Slovakia",
      "premium chauffeur service"
  ],
  openGraph: {
    title: "Preprava osôb po celom Slovensku a do okolitých krajín | BY THE WAVE",
    description:
      "Luxusná preprava osôb po Slovensku a do okolitých krajín. Letiskové transfery, individuálne jazdy a profesionálni šoféri.",
    url: "https://bythewave.sk/preprava-osob",
  },
  alternates: {
    canonical: "https://bythewave.sk/preprava-osob",
  },
}

export default function PrepravaOsobPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Structured Data for Passenger Transport Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Preprava osôb a letiskové transfery",
            description:
              "Komfortná a spoľahlivá preprava osôb po celom Slovensku a do okolitých krajín vrátane VIP transferov na letiská.",
            provider: {
              "@type": "Organization",
              name: "BY THE WAVE",
            },
            areaServed: [
              {
                "@type": "Country",
                name: "Slovakia",
              },
              {
                "@type": "Country",
                name: "Austria",
              },
              {
                "@type": "Country",
                name: "Hungary",
              },
              {
                "@type": "Country",
                name: "Czech Republic",
              },
              {
                "@type": "Country",
                name: "Poland",
              },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Passenger Transport Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Letiskový transfer",
                    description:
                      "Transfery na letiská ako Bratislava, Viedeň, Budapešť, Praha a ďalšie.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Medzinárodná preprava osôb",
                    description:
                      "Preprava osôb medzi Slovenskom a okolitými krajinami s profesionálnym šoférom.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Preprava osôb po Slovensku",
                    description:
                      "Komfortná preprava pre jednotlivcov, firmy, eventy a skupiny po celom Slovensku.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Šofér na objednávku",
                    description:
                      "Profesionálny šofér pre vaše jazdy, služobné cesty alebo špeciálne príležitosti.",
                  },
                },
              ],
            },
          }),
        }}
      />

      {/* Services Section */}
      <section className="py-4 px-6 pt-32 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
              Rezervačný formulár
              <span className="block text-[#B88746]">na prepravu osôb</span>
            </h1>

            <p className="text-[#CCCCCC] mt-6 leading-relaxed max-w-3xl mx-auto">
              Vyplňte krátky nezáväzný formulár a na základe poskytnutých informácií vás budeme kontaktovať s individuálnou cenovou ponukou.
            </p>
          </div>
        </div>
      </section>

      <ReservationForm/>

      {/* Vehicle Showcase */}
      <section className="py-20 px-6 bg-[#1D1D1D] relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">NAŠE VOZIDLÁ</h2>

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

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">PREČO SI NÁS VYBRAŤ</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
