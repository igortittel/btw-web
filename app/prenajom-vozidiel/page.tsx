import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { ExpandableSection } from "@/components/expandable-section"
import { ScrollToTop } from "@/components/scroll-to-top"
import Link from "next/link"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prenájom vozidiel - Krátkodobý a dlhodobý prenájom áut Slovensko",
  description:
    "Prenájom vozidiel na Slovensku od 1 dňa až po 4 roky. Krátkodobý a dlhodobý prenájom luxusných áut s komplexným servisom. Mercedes, BMW, Hyundai Staria. Ceny od 85€/deň.",
  keywords: [
    "prenájom vozidiel Slovensko",
    "krátkodobý prenájom áut",
    "dlhodobý prenájom vozidiel",
    "car rental Slovakia",
    "prenájom áut Bratislava",
    "luxusné vozidlá prenájom",
    "Mercedes prenájom",
    "BMW prenájom dlhodobý",
  ],
  openGraph: {
    title: "Prenájom vozidiel - Krátkodobý a dlhodobý prenájom | BY THE WAVE",
    description: "Prenájom vozidiel na Slovensku od 1 dňa až po 4 roky. Komplexný servis, poistenie a údržba v cene.",
    url: "https://bythewave.sk/prenajom-vozidiel",
  },
  alternates: {
    canonical: "https://bythewave.sk/prenajom-vozidiel",
  },
}

export default function PrenajomVozidielPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Structured Data for Rental Services */}
      <Script
        id="structured-data-rental"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Prenájom vozidiel",
            description: "Krátkodobý a dlhodobý prenájom luxusných vozidiel na Slovensku",
            provider: {
              "@type": "Organization",
              name: "BY THE WAVE",
            },
            areaServed: {
              "@type": "Country",
              name: "Slovakia",
            },
            offers: [
              {
                "@type": "Offer",
                name: "Krátkodobý prenájom vozidiel",
                description: "Prenájom vozidiel od 1 dňa",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: "85",
                  priceCurrency: "EUR",
                  unitText: "deň",
                },
              },
              {
                "@type": "Offer",
                name: "Dlhodobý prenájom vozidiel",
                description: "Prenájom vozidiel od 30 dní až po 4 roky",
              },
            ],
          }),
        }}
      />

      <section className="py-20 px-6 pt-32 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white text-center mb-8">
              Krátkodobý a&nbsp;dlhodobý
              <span className="block text-[#B88746]">prenájom vozidiel</span>
          </h1>

          <p className="text-[#CCCCCC] text-center mb-16 leading-relaxed max-w-4xl mx-auto">
            Hľadáte flexibilné riešenie mobility bez viazanosti? Či už potrebujete auto na pár dní, alebo na niekoľko
            mesiacov/rokov, u nás si vyberiete. Zistite, aký je rozdiel medzi krátkodobým a dlhodobým prenájmom, ich
            výhody a všetky praktické podmienky a vyberte si jednu z možností.
          </p>

          {/* Rental Service Cards */}
          <div className="space-y-6 mb-16">
            <div className="bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-[#B88746] text-2xl flex-shrink-0">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Krátkodobý prenájom vozidiel</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Ideálny na víkend, dovolenku, výlet, služobnú cestu alebo prechodné obdobie.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">Hlavné benefity:</h3>
                  <ul className="text-[#CCCCCC] text-sm space-y-2">
                    <li>• Vozidlo už od 1 dňa</li>
                    <li>• Poistenie (PZP + havarijné) v cene</li>
                    <li>• Pravidelný servis a sezónne prezutie</li>
                    <li>• Diaľničná známka pre SR</li>
                    <li>• Zvýhodnená cena prepravy osôb</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Vhodné pre:</h3>
                  <ul className="text-[#CCCCCC] text-sm space-y-2">
                    <li>• Jednotlivcov aj firmy</li>
                    <li>• Potrebu mobility na pár dní až niekoľko týždňov</li>
                    <li>• Nečakané situácie (porucha vlastného vozidla, výlet, sťahovanie)</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-8 py-3 rounded-lg">
                    Chcem krátkodobý prenájom
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-[#B88746] text-2xl flex-shrink-0">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Dlhodobý prenájom vozidiel</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Riešenie bez starostí na dlhšie obdobie – od 30 dní až po maximálne 4 roky. Čím dlhšie vozidlo
                    využívate, tým výhodnejšiu cenu získate.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-8">
                <div>
                  <h3 className="text-white font-semibold mb-4">Hlavné benefity:</h3>
                  <ul className="text-[#CCCCCC] text-sm space-y-2">
                    <li>• Stabilná mesačná cena bez skrytých poplatkov</li>
                    <li>• Kompletný balík služieb: komplexné poistenie, servis, sezónne prezutie a diaľničná známka</li>
                    <li>• Zľavy na iné služby (napr. preprava osôb, krátkodobý prenájom, Executive mobility)</li>
                    <li>• Možnosť výmeny vozidla pri dlhodobom využívaní</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Vhodné pre:</h3>
                  <ul className="text-[#CCCCCC] text-sm space-y-2">
                    <li>• Firemných klientov</li>
                    <li>• Jednotlivcov bez vlastného auta</li>
                    <li>• Expati, dočasne žijúci alebo pracujúci na Slovensku</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Link href="https://booqme.sk/sk/rezervacia/btw" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-8 py-3 rounded-lg">
                    Chcem dlhodobý prenájom
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="mb-16">
            <ExpandableSection title="Je možné si vozidlo prenajať aj ako fyzická osoba?">
              <p className="text-sm">
                Áno prenájom je dostupný pre jednotlivcov aj firmy. Stačí platný občiansky a vodičský preukaz.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Aký je minimálny vek pre prenájom auta?">
              <p className="text-sm">Vodič musí mať minimálne 21 rokov a mať vodičský preukaz aspoň 2 roky.</p>
            </ExpandableSection>

            <ExpandableSection title="Ako prebieha platba?">
              <p className="text-sm">
                Platbu je možné uskutočniť kartou, prevodom alebo (pri firmách) aj na faktúru. V každom prípade treba
                zaplatiť kauciu, ktorá slúži na pokrytie za škôd či ceny vozidla.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Je potrebné vozidlo natankovať pred vrátením?">
              <p className="text-sm">
                Áno vozidlo sa vracia s rovnakým množstvom paliva, s akým ste ho prevzali. Ak nechcete dostankovať,
                doúčtujeme palivo.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Musím mať vlastnú poisťku?">
              <p className="text-sm">Nie, všetky naše vozidlá sú poistené - máte v cene PZP aj havarijné poistenie.</p>
            </ExpandableSection>

            <ExpandableSection title="Koľko kilometrov môžem najazdíť?">
              <p className="text-sm">
                Pri krátkodobom prenájme je to max. 400 km/deň (každý kilometer navyše je spoplatnený sumou 0,45 €). Pri
                dlhodobom prenájme záleží od dohody.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Môžem si vybrať konkrétny model?">
              <p className="text-sm">
                Áno pri krátkodobej rezervácii si vyberiete z dostupných modelov. V prípade dlhodobého prenájmu si
                môžete vybrať buď z dostupných modelov alebo požiadať o konkrétne vozidlo podľa želania.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Je potrebné sa vopred objednať?">
              <p className="text-sm">
                Odporúčame rezerváciu vopred, najmä v sezóne. Tak vieme zaručiť dostupnosť vybraného vozidla.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Môžem vozidlo používať aj v zahraničí?">
              <p className="text-sm">
                Áno, ale túto informáciu je potrebné uviesť pri rezervácii. Zahraničný prenájom má vlastné podmienky a
                môže byť spoplatnený.
              </p>
            </ExpandableSection>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  )
}
