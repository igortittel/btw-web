import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureCard } from "@/components/feature-card"
import { ContactForm } from "@/components/contact-form"
import { ServiceCard } from "@/components/service-card"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ExpandableSection } from "@/components/expandable-section"
import Link from "next/link"
import type { Metadata } from "next"
import { VehicleShowcase } from "@/components/vehicle-showcase"
import Image from "next/image"
import { Reveal } from "@/components/Reveal"

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
      <section className="py-20 px-6 pt-32 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <Reveal y={32}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
                Prémiová preprava osôb
                <span className="block text-[#B88746]">bez stresu a kompromisov</span>
              </h1>
            </Reveal>

            <Reveal y={24} delay={0.08}>
              <p className="text-[#CCCCCC] mt-6 leading-relaxed max-w-3xl mx-auto">
                Letiská, firmy, eventy aj súkromné cesty. Profesionálny šofér, komfortné vozidlá a cena vopred.
              </p>
            </Reveal>

            <Reveal y={16} delay={0.12}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-10 py-3 rounded-lg">
                    Zistiť cenu a dostupnosť
                  </Button>
                </Link>
              </div>
            </Reveal>

            <Reveal y={24} delay={0.16}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3">
                <div className="text-xs uppercase tracking-widest text-[#777777]">
                  Najčastejšie využitie
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#CCCCCC]">
                  <span className="flex items-center gap-2">
                    <span className="text-base">✈️</span>
                    <span>Odvoz na letisko</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">🏢</span>
                    <span>Firemné transfery</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">🎉</span>
                    <span>Eventy</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">💍</span>
                    <span>Svadby</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-base">🌍</span>
                    <span>Zahraničné cesty</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Transfer Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <Reveal y={24}>
              <div className="group bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8 transition-all duration-200 hover:bg-[#242424] hover:border-[#D2A15E] flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Letiskový transfer</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Ideálny spôsob dopravy na letisko bez stresu. Sledujeme váš let, prispôsobíme sa zmenám a zabezpečíme pohodlný odvoz aj príjazd.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-center opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg">
                    Zistiť cenu
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal y={24} delay={0.06}>
              <div className="group bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8 transition-all duration-200 hover:bg-[#242424] hover:border-[#D2A15E] flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Transfer na vlak / autobus</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Spoľahlivá doprava na stanicu alebo z nej. Presnosť a komfort pri každom presune, či už cestujete pracovné alebo súkromne.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-center opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg">
                    Zistiť cenu
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal y={24} delay={0.12}>
              <div className="group bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8 transition-all duration-200 hover:bg-[#242424] hover:border-[#D2A15E] flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Medzinárodná preprava</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Komfortné transfery do Rakúska, Maďarska, Česka, Poľska či Nemecka. Perfektné riešenie pre dlhšie trasy aj cross-border cestovanie.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-center opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg">
                    Zistiť cenu
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal y={24} delay={0.18}>
              <div className="group bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8 transition-all duration-200 hover:bg-[#242424] hover:border-[#D2A15E] flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Firemná preprava</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Doprava pre zamestnancov, manažérov alebo delegácie. Diskrétnosť, presnosť a profesionálny dojem na každom kroku.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-center opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg">
                    Zistiť cenu
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal y={24} delay={0.24}>
              <div className="group bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8 transition-all duration-200 hover:bg-[#242424] hover:border-[#D2A15E] flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Preprava osôb na eventy</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    VIP preprava na konferencie, koncerty, športové podujatia a firemné akcie. Perfektná voľba, keď záleží na presnosti a dojme.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-center opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg">
                    Zistiť cenu
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <Reveal y={24} delay={0.30}>
              <div className="group bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl p-8 transition-all duration-200 hover:bg-[#242424] hover:border-[#D2A15E] flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Svadby a oslavy</h2>
                  <p className="text-[#CCCCCC] text-sm">
                    Preprava osôb so šoférom počas celej doby oslavy či svadby pre novomanželov aj hostí. Elegantný príchod, spoľahlivý odvoz a bezchybný servis pri každej príležitosti.
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-center opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Link href="/rezervacie">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg">
                    Zistiť cenu
                  </Button>
                </Link>
              </div>
              </div>
            </Reveal>

            <div className="lg:col-span-3 w-full p-8 flex flex-col items-center gap-3">
              <Reveal y={16} delay={0.18}>
                <Link href="/rezervacie" className="inline-flex">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-8 py-3 rounded-lg">
                    Objednať prepravu osôb
                  </Button>
                </Link>
              </Reveal>

              <Reveal y={16} delay={0.24}>
                <a href="/cennik-2026.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <Button className="border border-[#B88746] text-[#B88746] hover:text-white hover:border-white font-medium px-8 py-3 rounded-lg">
                    Zobraziť cenník
                  </Button>
                </a>
              </Reveal>
            </div>
          </div>

       {/* Hero Section */}
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[75vh] min-h-[520px] flex items-center justify-center text-center overflow-hidden">
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
                    Už od 73 €
                  </span>
                  <span className="hidden sm:inline text-sm md:text-base text-white/80">
                    Bratislava – Schwechat
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal y={16} delay={0.12}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/transfer-bratislava-schwechat">
                  <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-10 py-3 rounded-lg">
                    Zistiť viac
                  </Button>
                </Link>
              </div>
            </Reveal>                
          </div>
        </section>          

          {/* FAQ Sections */}
          <Reveal y={32}>
            <div className="mt-24 mb-16">
              <ExpandableSection title="Ako si môžem objednať prepravu?">
                <p className="text-sm">
                  Prepravu si viete objednať online cez náš rezervačný formulár alebo telefonicky. Stačí uviesť
                  miesto nástupu, cieľ cesty, dátum, čas a počet osôb. Následne vám potvrdíme dostupnosť a cenu.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Ako dlho vopred je potrebné rezervovať?">
                <p className="text-sm">
                  Ideálne je rezervovať aspoň 24 hodín vopred, pri letiskových a medzinárodných transferoch odporúčame
                  48 hodín. V naliehavých prípadoch sa vždy snažíme nájsť riešenie aj last minute.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Čo ak má môj let meškanie?">
                <p className="text-sm">
                  Lety aktívne sledujeme podľa čísla letu, ktoré zadáte pri rezervácii. Pri meškaní prispôsobíme čas
                  vyzdvihnutia. Kratšie meškania sú bez doplatku, pri dlhšom čakaní vás vopred informujeme o prípadnom
                  príplatku.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Koľko osôb a batožiny viete odviezť?">
                <p className="text-sm">
                  Vozidlá kategórie First Class a Business Class majú kapacitu 1–3 osoby s batožinou, vo vozidlách kategórie Business Van je kapacita 6–8 osôb v závislosti od modelu vozidla.
                  Presnú kapacitu vám odporučíme podľa počtu osôb a kufrov pri rezervácii, aby ste mali maximálne pohodlie.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Poskytujete detské autosedačky?">
                <p className="text-sm">
                  Áno, na požiadanie vieme zabezpečiť detskú sedačku alebo podsedák pre rôzne vekové kategórie.
                  Stačí pri rezervácii uviesť počet detí a približný vek.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Aké územie pokrývate?">
                <p className="text-sm">
                  Zabezpečujeme prepravu po celom Slovensku a do okolitých krajín, najmä Rakúsko, Maďarsko, Česko a
                  Poľsko. Pri dlhších medzinárodných trasách vám pripravíme individuálnu cenovú ponuku.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Ako prebieha platba?">
                <p className="text-sm">
                Platba je možná v hotovosti, platobnou kartou priamo vo vozidle prostredníctvom platobného terminálu, platbou vopred na účet alebo na faktúru pre firemných klientov. Podrobné podmienky platby sú uvedené v cenovej ponuke, ktorú od nás dostanete po potvrdení rezervácie.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Aké sú storno podmienky?">
                <p className="text-sm">
                  Bezplatné storno je možné do určitého času pred odchodom (spravidla 24 hodín). Pri neskoršom zrušení
                  alebo nevyužití prepravy sa môže účtovať storno poplatok. Detaily vždy uvádzame v potvrdení rezervácie.
                </p>
              </ExpandableSection>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-20 px-6 bg-[#1D1D1D] relative">
        <div className="max-w-6xl mx-auto">
          <Reveal y={24}>
            <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">NAŠE VOZIDLÁ</h2>
          </Reveal>

          <Reveal y={32} delay={0.08}>
            <div className="relative">
              <VehicleShowcase />
            </div>
          </Reveal>

          <Reveal y={16} delay={0.12}>
            <div className="text-center mt-8">
              <Link href="/nase-vozidla">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2">
                  Zobraziť všetky vozidlá
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <Reveal y={24}>
            <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">PREČO SI NÁS VYBRAŤ</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Reveal y={24}>
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
            <Reveal y={24} delay={0.06}>
              <FeatureCard
                icon={<Image src="/images/time-icon.svg" alt="Time" width={32} height={32} className="w-8 h-8" />}
                title="Časová efektívita"
                description="Vždy na čas a pripravení na vašu cestu. Spoľahnite sa na našu presnosť a profesionalitu."
              />
            </Reveal>
            <Reveal y={24} delay={0.12}>
              <FeatureCard
                icon={<Image src="/images/diamond-icon.svg" alt="Diamond" width={32} height={32} className="w-8 h-8" />}
                title="Exkluzívne autá"
                description="Naše vozidlá predstavujú špičkovú luxus a prestíž"
              />
            </Reveal>
            <Reveal y={24} delay={0.18}>
              <FeatureCard
                icon={<Image src="/images/money-icon.svg" alt="Money" width={32} height={32} className="w-8 h-8" />}
                title="Cena a kvalita"
                description="Sme jedni z najlepších v pomere cena a kvalita"
              />
            </Reveal>
          </div>

          <Reveal y={16} delay={0.12}>
            <div className="text-center mt-12">
              <Link href="/sluzby">
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
