import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Reveal } from "@/components/Reveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Transfer Bratislava – Schwechat | Odvoz na letisko Viedeň (VIE) | By The Wave",
  description:
    "Súkromný letiskový transfer z Bratislavy na letisko Viedeň Schwechat (VIE). Fixná cena, profesionálny vodič, dostupné 24/7.",
  keywords: [
    "odvoz na letisko schwechat",
    "transfer bratislava schwechat",
    "letiskový transfer schwechat",
    "doprava na letisko viedeň",
    "vyzdvihnutie na letisku schwechat",
  ],
  alternates: {
    canonical: "https://btw.sk/transfer-bratislava-schwechat",
  },
  openGraph: {
    title: "Transfer Bratislava – Schwechat | By The Wave",
    description:
      "Súkromný transfer Bratislava – Schwechat (VIE). Fixná cena, 24/7 dostupnosť.",
    url: "https://btw.sk/transfer-bratislava-schwechat",
    type: "website",
    images: [
      {
        url: "https://btw.sk/images/hero-poster.webp",
        width: 1200,
        height: 630,
        alt: "Transfer Bratislava Schwechat – By The Wave",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transfer Bratislava – Schwechat | By The Wave",
    description:
      "Súkromný letiskový transfer z Bratislavy na letisko Viedeň (VIE).",
    images: ["https://btw.sk/images/hero-poster.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function TransferBratislavaSchwechatPage() {
  // --- Vehicles (server-side) ---
  const getPriceNumber = (v: any) => {
    const raw = v?.popisVozidla?.cena
    if (!raw) return Number.POSITIVE_INFINITY

    const digits = String(raw).match(/\d+/g)
    if (!digits || digits.length === 0) return Number.POSITIVE_INFINITY

    return Number(digits.join("")) || Number.POSITIVE_INFINITY
  }

  const sortByPriceAsc = (list: any[]) => [...list].sort((a, b) => getPriceNumber(a) - getPriceNumber(b))

  const isTransfer = (v: any) => Array.isArray(v?.popisVozidla?.typ) && v.popisVozidla.typ.includes("Transfer")

  let rentalVehicles: any[] = []
  let transferVehicles: any[] = []
  let loading = false
  let error: string | null = null

  try {
    // Dynamic import prevents route-level 500 if the graphql module throws during static import.
    const { fetchVehicles } = await import("@/lib/graphql")
    const vehicles = await fetchVehicles()
    const all = sortByPriceAsc(Array.isArray(vehicles) ? vehicles : [])

    transferVehicles = all.filter(isTransfer)
    rentalVehicles = all.filter((v) => !isTransfer(v))
  } catch (e) {
    rentalVehicles = []
    transferVehicles = []
    error = "Nepodarilo sa načítať vozidlá. Skúste to prosím znovu."
  }

  // Default tab = transfer (server-side)
  const activeTab: "prenajom" | "transfer" = "transfer"

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Structured Data */}
      <Script
        id="ld-json-transfer-bratislava-schwechat"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Letiskový transfer Bratislava – Schwechat",
            serviceType: "Airport transfer",
            areaServed: {
              "@type": "Place",
              name: "Bratislava, Slovensko",
            },
            provider: {
              "@type": "LocalBusiness",
              name: "By The Wave",
              url: "https://btw.sk",
            },
            availableChannel: {
              "@type": "ServiceChannel",
              serviceLocation: {
                "@type": "Place",
                name: "Vienna International Airport (VIE)",
              },
            },
          }),
        }}
      />

      <main>
        {/* Hero Section */}
        <section className="relative w-full h-[75vh] min-h-[520px] flex items-center justify-center text-center overflow-hidden">
          {/* Desktop Image */}
          <div className="hidden md:block absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('/images/transfer-bratislava-schwechat-desktop.webp')" }} />

          {/* Mobile Image */}
          <div className="block md:hidden absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: "url('/images/transfer-bratislava-schwechat-mobile.webp')" }} />

          {/* Dark Overlay Desktop */}
          <div className="hidden md:block absolute inset-0 bg-black/80" />

          {/* Dark Overlay Mobile */}
          <div className="block md:hidden absolute inset-0 bg-black/55" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl px-6">
            <Reveal y={24} delay={0.05}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
                Odvoz na letisko Schwechat
                <span className="block text-[#B88746]">bez stresu a čakania</span>
              </h1>
            </Reveal>

            <Reveal y={24} delay={0.15}>
              <div className="mt-6">
                <p className="text-base md:text-xl text-white/90 leading-relaxed">
                  Súkromný transfer z Bratislavy a okolia na letisko Schwechat (VIE).
                </p>

                <div className="mt-6 inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-7 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                  <span className="text-base md:text-xl font-semibold tracking-wide text-[#B88746]">
                    Už od 73 € bez DPH
                  </span>
                  <span className="hidden sm:inline text-sm md:text-base text-white/80">
                    Bratislava – Schwechat
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        {/* Content Section */}
        <section className="py-20 px-6 bg-[#0B0B0B]">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal y={24} delay={0.05}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                Transfer Bratislava – Letisko Viedeň Schwechat
              </h2>
            </Reveal>

            <Reveal y={24} delay={0.15}>
              <p className="mt-8 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Hľadáte spoľahlivý odvoz na letisko Schwechat z Bratislavy? Zabezpečujeme pohodlný a bezpečný transfer
                z Bratislavy a okolia až priamo pred terminál letiska Viedeň Schwechat (VIE).
              </p>
            </Reveal>

            <Reveal y={24} delay={0.25}>
              <p className="mt-6 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Cestu plánujeme podľa času vášho odletu alebo príletu, sledujeme aktuálnu dopravnú situáciu a
                zabezpečíme, aby ste dorazili načas – bez stresu a zbytočných komplikácií.
              </p>
            </Reveal>

            <Reveal y={24} delay={0.16}>
              <div className="mt-12 flex flex-col items-center justify-center gap-3">
                <div className="text-xs uppercase tracking-widest text-[#777777]">
                  Prečo si vybrať náš letiskový transfer
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#CCCCCC]">
                  <span className="flex items-center gap-2">
                    <span className="text-base">🅿️</span>
                    <span>Žiadne parkovanie</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">⏱</span>
                    <span>Žiadne meškanie</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">😌</span>
                    <span>Žiadny stres</span>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal y={16} delay={0.12}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-10 py-3 rounded-lg">
                    Rezervovať odvoz
                  </Button>
                </Link>
              </div>
            </Reveal>            

            <Reveal y={24} delay={0.35}>
              <p className="mt-10 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                By The Wave poskytuje súkromnú dopravu na letisko Viedeň Schwechat (VIE) 24/7 – pre jednotlivcov,
                business klientov, rodiny aj väčšie skupiny. Cestujete pohodlne, bezpečne a bez kompromisov.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-6 bg-[#0F0F0F]">
          <div className="max-w-5xl mx-auto text-center">
            <Reveal y={24} delay={0.05}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                Prečo si vybrať náš letiskový transfer?
              </h2>
            </Reveal>

            <Reveal y={24} delay={0.15}>
              <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left text-[#CCCCCC]">
                <div>✔ Fixná cena vopred</div>
                <div>✔ Príchod šoféra minimálne 10 minút pred vyzdvihnutím</div>
                <div>✔ Sledovanie letu pri návrate</div>
                <div>✔ Detská sedačka na požiadanie</div>
                <div>✔ Platba kartou, na FA, v hotovosti alebo prevodom</div>
                <div>✔ Komfortné vozidlá business van a limousine</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Travel Time Section */}
        <section className="py-20 px-6 bg-[#0B0B0B]">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal y={24} delay={0.05}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                Ako dlho trvá cesta na Schwechat?
              </h2>
            </Reveal>

            <Reveal y={24} delay={0.15}>
              <p className="mt-8 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Vzdialenosť Bratislava – Schwechat je približne 60 km. Transfer trvá 45 – 60 minút podľa premávky.
              </p>
            </Reveal>

            <Reveal y={24} delay={0.25}>
              <p className="mt-6 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Pri skorých ranných letoch plánujeme rezervu tak, aby bol klient na letisku načas.
              </p>
            </Reveal>
          </div>

          <Reveal y={16} delay={0.12}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-10 py-3 rounded-lg">
                    Rezervovať odvoz
                  </Button>
                </Link>
              </div>
            </Reveal>               
        </section>

        {/* Airport Pickup Section */}
        <section className="relative py-20 px-6 overflow-hidden">

          {/* Desktop Background */}
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/staria-desktop.webp')" }}
          />

          {/* Mobile Background */}
          <div
            className="block md:hidden absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/staria-mobile.webp')" }}
          />

          {/* Dark Overlay 80% */}
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Reveal y={24} delay={0.05}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                Vyzdvihnutie z letiska Schwechat
              </h2>
            </Reveal>

            <Reveal y={24} delay={0.15}>
              <p className="mt-8 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Pri prílete neustále sledujeme lietadlo podľa čísla letu. Ak má lietadlo meškanie, čakáme.
              </p>
            </Reveal>

            <Reveal y={24} delay={0.25}>
              <p className="mt-6 text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Klientov vyzdvihneme priamo v príletovej hale a odvezieme ich späť do Bratislavy alebo okolia podľa požiadaviek.
              </p>
            </Reveal>
          </div>          
        </section>

 
      </main>

      <Footer />
    </div>
  )
}
