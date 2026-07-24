import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Reveal } from "@/components/Reveal"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Súkromný transfer Bratislava – Schwechat: Kedy dáva zmysel viac ako autobus?",
  description:
    "Detailné porovnanie nákladov, komfortu a scenárov. Transfer Bratislava – Schwechat pre tých, ktorí rozhodujú na základe faktov.",
  alternates: {
    canonical: "https://btw.sk/blog/sukromny-transfer-bratislava-schwechat",
  },
  openGraph: {
    title: "Súkromný transfer Bratislava – Schwechat: Kedy dáva zmysel viac ako autobus?",
    description:
      "Detailné porovnanie nákladov, komfortu a scenárov. Transfer Bratislava – Schwechat pre tých, ktorí rozhodujú na základe faktov.",
    url: "https://btw.sk/blog/sukromny-transfer-bratislava-schwechat",
    type: "article",
    images: [
      {
        url: "https://btw.sk/images/bts-vie.png",
        width: 1200,
        height: 630,
        alt: "Súkromný transfer Bratislava – Schwechat | By The Wave",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Súkromný transfer Bratislava – Schwechat: Kedy dáva zmysel viac ako autobus?",
  description:
    "Detailné porovnanie nákladov, komfortu a scenárov. Transfer Bratislava – Schwechat pre tých, ktorí rozhodujú na základe faktov.",
  image: "https://btw.sk/images/bts-vie.png",
  author: { "@type": "Organization", name: "By The Wave", url: "https://btw.sk" },
  publisher: {
    "@type": "Organization",
    name: "By The Wave",
    logo: { "@type": "ImageObject", url: "https://btw.sk/images/logo.svg" },
  },
  datePublished: "2026-07-21",
  dateModified: "2026-07-21",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://btw.sk/blog/sukromny-transfer-bratislava-schwechat",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Koľko stojí transfer Bratislava – Schwechat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cena súkromného transferu Bratislava – Schwechat závisí od miesta vyzdvihnutia, zvoleného vozidla a počtu cestujúcich. Presnú cenu dostanete po odoslaní dopytu na btw.sk.",
      },
    },
    {
      "@type": "Question",
      name: "Príde šofér aj mimo Bratislavy — z Trnavy, Nitry alebo iného mesta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Áno. By The Wave zabezpečuje transfer na Schwechat z celého Slovenska. Šofér príde priamo na adresu vyzdvihnutia — bez prestupu na autobusovú stanicu. Cena sa odvíja od vzdialenosti.",
      },
    },
    {
      "@type": "Question",
      name: "Čo ak má môj let pri prílete meškanie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Šofér sleduje číslo letu v reálnom čase a čaká bez ohľadu na oneskorenie — bez poplatkov navyše. Po pristátí vás privíta v príletovej hale s tabuľkou s vaším menom.",
      },
    },
    {
      "@type": "Question",
      name: "Je na rezerváciu transferu potrebná registrácia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nie. Dopyt na btw.sk nevyžaduje vytvorenie účtu. Vyplníte trasu, dátum a kontaktné údaje — cenu dostanete obratom.",
      },
    },
    {
      "@type": "Question",
      name: "Akými vozidlami sa realizuje transfer Bratislava – Schwechat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Transfer sa realizuje vozidlami tried Business Class, Business Van a First Class — Mercedes-Benz E-Class, S-Class, GLS, V-Class, Hyundai Staria Luxury a ďalšie. Všetky vozidlá poskytujú dostatok priestoru pre cestujúcich aj batožinu.",
      },
    },
  ],
}

function IconLocation() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="11" r="5" stroke="#B88746" strokeWidth="1.8"/>
      <path d="M14 28C14 28 4 18.5 4 11C4 5.477 8.477 1 14 1C19.523 1 24 5.477 24 11C24 18.5 14 28 14 28Z" stroke="#B88746" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="14" cy="11" r="2" fill="#B88746"/>
    </svg>
  )
}

function IconLuggage() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="20" height="16" rx="2" stroke="#B88746" strokeWidth="1.8"/>
      <path d="M10 10V7C10 5.895 10.895 5 12 5H16C17.105 5 18 5.895 18 7V10" stroke="#B88746" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="4" y1="17" x2="24" y2="17" stroke="#B88746" strokeWidth="1.8"/>
      <line x1="9" y1="10" x2="9" y2="26" stroke="#B88746" strokeWidth="1.2" strokeOpacity="0.4"/>
      <line x1="19" y1="10" x2="19" y2="26" stroke="#B88746" strokeWidth="1.2" strokeOpacity="0.4"/>
    </svg>
  )
}

function IconRadar() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" stroke="#B88746" strokeWidth="1.8" strokeOpacity="0.25"/>
      <circle cx="14" cy="14" r="7.5" stroke="#B88746" strokeWidth="1.8" strokeOpacity="0.45"/>
      <circle cx="14" cy="14" r="3" stroke="#B88746" strokeWidth="1.8"/>
      <path d="M14 14L22 6" stroke="#B88746" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="22" cy="6" r="1.8" fill="#B88746"/>
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H13L25 15L15 25L3 13V3Z" stroke="#B88746" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="8.5" cy="8.5" r="1.8" fill="#B88746"/>
      <path d="M10 17L17 10" stroke="#B88746" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
    </svg>
  )
}

const serviceFeatures = [
  {
    Icon: IconLocation,
    title: "Door-to-door",
    subtitle: "Kdekoľvek na Slovensku",
    description:
      "Šofér príde priamo na vašu adresu — bez prestupu na zastávku a bez hľadania parkoviska. Transfer zabezpečujeme z Bratislavy aj z celého okolia vrátane Trnavy, Nitry a Malaciek.",
  },
  {
    Icon: IconLuggage,
    title: "Pomoc s batožinou",
    subtitle: "Bez obmedzení priestoru",
    description:
      "Šofér preberá batožinu pri nástupe a odovzdáva ju pri cieli. Vozidlá tried Business Class, Business Van a First Class poskytujú dostatok priestoru pre všetky typy batožiny.",
  },
  {
    Icon: IconRadar,
    title: "Sledovanie letu",
    subtitle: "V reálnom čase",
    description:
      "Šofér sleduje číslo letu automaticky. Pri meškaní čaká — bez telefonátov a bez poplatkov navyše. Pri prílete vás privíta v hale s tabuľkou s vaším menom.",
  },
  {
    Icon: IconTag,
    title: "Cena dopredu",
    subtitle: "Žiadne prekvapenia",
    description:
      "Cenu svojej cesty poznáte pred odchodom. Platba kartou, prevodom alebo v hotovosti — na faktúru pre firmu aj pre súkromné osoby.",
  },
]

const faqItems = [
  {
    q: "Koľko stojí transfer Bratislava – Schwechat?",
    a: "Cena závisí od miesta vyzdvihnutia, zvoleného vozidla a počtu cestujúcich. Presnú cenu dostanete po odoslaní dopytu na btw.sk — obratom a bez záväzkov.",
  },
  {
    q: "Príde šofér aj z Trnavy, Nitry alebo iného mesta?",
    a: "Áno. Transfer zabezpečujeme z celého Slovenska priamo na adrese cestujúceho. Cena sa odvíja od vzdialenosti miesta vyzdvihnutia.",
  },
  {
    q: "Čo ak má môj let pri prílete meškanie?",
    a: "Šofér sleduje číslo letu v reálnom čase a čaká bez ohľadu na oneskorenie — bez poplatkov navyše. Po príchode do príletovej haly vás privíta s tabuľkou s vaším menom.",
  },
  {
    q: "Je na dopyt potrebná registrácia?",
    a: "Nie. Dopyt na btw.sk nevyžaduje vytvorenie účtu. Vyplníte trasu, dátum a kontaktné údaje — cenu dostanete obratom.",
  },
  {
    q: "Akými vozidlami sa realizuje transfer?",
    a: "Transfer sa realizuje vozidlami tried Business Class, Business Van a First Class — Mercedes-Benz E-Class, S-Class, GLS, V-Class, Hyundai Staria Luxury a ďalšie. Každé vozidlo poskytuje dostatok priestoru pre cestujúcich aj batožinu.",
  },
]

export default function BlogArticlePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      <Script
        id="ld-article"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-16">

        {/* ─── Hero ─── */}
        <section className="relative w-full h-[60vh] min-h-[420px] flex items-end justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bts-vie.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

          <div className="relative z-10 w-full max-w-3xl px-6 pb-14 text-center">
            <Reveal y={20} delay={0.05}>
              <span className="inline-block text-xs uppercase tracking-widest text-[#B88746] mb-4">
                Letiskový transfer · Porovnanie
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Súkromný transfer Bratislava – Schwechat:{" "}
                <span className="text-[#B88746]">Kedy dáva zmysel</span>{" "}
                viac ako autobus?
              </h1>
            </Reveal>
          </div>
        </section>

        {/* ─── Lead ─── */}
        <section className="bg-[#0B0B0B] py-10 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal y={16} delay={0.05}>
              <p className="text-lg md:text-xl text-[#CCCCCC] leading-relaxed font-medium">
                Cena lístka na autobus Bratislava – Schwechat začína na 7 eurách.
                Celkové náklady cesty závisia od iných premenných — a pri konkrétnych
                scenároch vychádzajú výrazne inak.
              </p>
            </Reveal>
            <Reveal y={12} delay={0.12}>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-[#555]">
                <span>5 min čítania</span>
                <span className="w-1 h-1 rounded-full bg-[#333]" />
                <span>By The Wave</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── Article body ─── */}
        <article className="py-16 px-6">
          <div className="max-w-2xl mx-auto">

            {/* Opening */}
            <Reveal y={16} delay={0.05}>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed mb-6">
                Rozhodovanie o doprave na letisko sa väčšinou zastaví pri jednom čísle: cena
                lístka. Zvyšok — doprava na zastávku, načasovanie, batožina, riziko meškania —
                zostáva nepočítaný.
              </p>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Tento prehľad dáva kompletný obraz. Bez predpokladov, s konkrétnymi číslami.
              </p>
            </Reveal>

            {/* ─── Section: Price comparison ─── */}
            <Reveal y={20} delay={0.08}>
              <h2 className="mt-14 mb-4 text-2xl md:text-3xl font-bold text-white tracking-wide">
                Skutočná cena cesty autobusom na Schwechat
              </h2>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed mb-4">
                Lístok na Slovak Lines alebo RegioJet stojí 5–10 €. To je východiskový bod — nie
                celkový náklad. Pre väčšinu cestujúcich vyzerá reálna cesta takto:
              </p>
            </Reveal>

            {/* Price table */}
            <Reveal y={20} delay={0.1}>
              <div className="mt-6 mb-4 overflow-x-auto rounded-xl border border-[#1a1a1a]">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="text-left px-5 py-4 text-[#555] font-medium w-[42%]" />
                      <th className="px-5 py-4 text-center font-semibold text-[#888] w-[29%]">
                        Autobus
                      </th>
                      <th className="px-5 py-4 text-center font-semibold text-[#B88746] w-[29%]">
                        Súkromný transfer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#111]">
                    {[
                      {
                        label: "Základná cena",
                        bus: "5–10 € / osoba",
                        transfer: "od 73 € / vozidlo",
                        transferNote: true,
                      },
                      {
                        label: "Doprava na zastávku",
                        bus: "+ 8–12 € (Bolt/taxi)",
                        busNeg: true,
                        transfer: "—",
                        transferPos: true,
                      },
                      {
                        label: "Vyzdvihnutie mimo Bratislavy",
                        bus: "nutný prestup",
                        busNeg: true,
                        transfer: "priamo na adrese",
                        transferPos: true,
                      },
                      {
                        label: "Dostupnosť 24 / 7",
                        bus: "podľa cestovného poriadku",
                        busNeg: true,
                        transfer: "áno",
                        transferPos: true,
                      },
                      {
                        label: "Pomoc s batožinou",
                        bus: "nie",
                        busNeg: true,
                        transfer: "áno",
                        transferPos: true,
                      },
                      {
                        label: "Meškanie letu pri prílete",
                        bus: "riziko zmeškaného spoja",
                        busNeg: true,
                        transfer: "šofér čaká",
                        transferPos: true,
                      },
                      {
                        label: "Nočný taxík (havarijný scenár)",
                        bus: "+ 90–130 €",
                        busNeg: true,
                        transfer: "—",
                        transferPos: true,
                      },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#080808]"}>
                        <td className="px-5 py-3.5 text-[#888]">{row.label}</td>
                        <td className={`px-5 py-3.5 text-center ${row.busNeg ? "text-[#aa4444]" : "text-[#777]"}`}>
                          {row.bus}
                        </td>
                        <td className={`px-5 py-3.5 text-center font-medium ${row.transferPos ? "text-[#B88746]" : row.transferNote ? "text-white" : "text-[#777]"}`}>
                          {row.transfer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-[#222]">
                      <td className="px-5 py-4 text-[#555] text-xs">
                        * Cena transferu je za celé vozidlo — pri 2+ cestujúcich sa delí.
                      </td>
                      <td />
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Reveal>

            {/* Callout */}
            <Reveal y={16} delay={0.08}>
              <blockquote className="my-12 pl-6 border-l-4 border-[#B88746]">
                <p className="text-xl md:text-2xl text-white font-medium leading-snug">
                  Pri dvoch cestujúcich sa cena transferu Bratislava – Schwechat delí na polovicu.
                  Rozdiel v nákladoch sa zmenšuje — rozdiel v komforte zostáva.
                </p>
              </blockquote>
            </Reveal>

            {/* ─── Section: When makes sense ─── */}
            <Reveal y={20} delay={0.06}>
              <h2 className="mt-4 mb-4 text-2xl md:text-3xl font-bold text-white tracking-wide">
                Situácie, kde je transfer Bratislava – Schwechat jednoznačnou voľbou
              </h2>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed mb-8">
                Pre cestujúceho, ktorý odlieta cez deň, cestuje sám a má len príručnú batožinu,
                je autobus funkčným riešením. Pre nasledujúce scenáre platí iná rovnica — a{" "}
                <Link
                  href="/transfer-bratislava-schwechat"
                  className="text-[#B88746] hover:underline underline-offset-4"
                >
                  transfer Bratislava – Schwechat
                </Link>{" "}
                vychádza ako jednoznačnejšia voľba:
              </p>
            </Reveal>

            <Reveal y={16} delay={0.08}>
              <div className="space-y-5">
                {[
                  {
                    n: "1",
                    title: "Dvaja cestujúci alebo viac",
                    body: "Cena transferu Bratislava – Schwechat sa delí medzi všetkých cestujúcich. Pri dvoch osobách je cenový rozdiel voči autobusu minimálny — pri troch a viac je transfer lacnejší ako kombinácia verejnej dopravy.",
                  },
                  {
                    n: "2",
                    title: "Väčší objem batožiny",
                    body: "Každý kufor nad 10 kg komplikuje cestu na stanicu aj presun v rámci letiska. Šofér preberá batožinu pri nástupe a odovzdáva ju pri cieli — bez kompromisov s priestorom.",
                  },
                  {
                    n: "3",
                    title: "Miesto vyzdvihnutia mimo Bratislavy",
                    body: "Súkromný transfer Bratislava – Schwechat zabezpečujeme z celého Slovenska. Šofér príde priamo na adresu — do Trnavy, Nitry, Malaciek alebo iného mesta — bez nutnosti presunu na autobusovú stanicu.",
                  },
                  {
                    n: "4",
                    title: "Skorý ranný alebo neskorý nočný let",
                    body: "Prvé autobusy smerom na Schwechat odchádzajú z Bratislavy po 5:00. Pre odlet o 6:30 to nestačí. Súkromný transfer funguje 24 hodín denne, 7 dní v týždni — bez obmedzení cestovného poriadku.",
                  },
                  {
                    n: "5",
                    title: "Meškanie letu pri prílete",
                    body: "Šofér sleduje číslo letu v reálnom čase. Oneskorenie sa prenáša automaticky — cestujúci nenájde prázdnu stanicu, ale šoféra s tabuľkou v príletovej hale, pripraveného na odchod nech príde o čokoľvek neskôr.",
                  },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B88746]/10 border border-[#B88746]/30 flex items-center justify-center mt-0.5">
                      <span className="text-[#B88746] text-sm font-bold">{item.n}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{item.title}</p>
                      <p className="text-[#AAAAAA] text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* ─── Section: Service features ─── */}
            <Reveal y={20} delay={0.08}>
              <h2 className="mt-16 mb-2 text-2xl md:text-3xl font-bold text-white tracking-wide">
                Štandard zahrnutý v každom transfere
              </h2>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed mb-10">
                Súkromný transfer Bratislava – Schwechat cez{" "}
                <Link href="/" className="text-[#B88746] hover:underline underline-offset-4">
                  btw.sk
                </Link>{" "}
                zahŕňa konkrétne parametre bez príplatkov:
              </p>
            </Reveal>

            {/* 4 feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {serviceFeatures.map((feat, i) => (
                <Reveal key={feat.title} y={20} delay={0.06 + i * 0.06}>
                  <div className="h-full bg-[#0D0D0D] border border-[#1a1a1a] rounded-xl p-6 flex flex-col gap-4 hover:border-[#B88746]/25 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-lg bg-[#B88746]/8 border border-[#B88746]/15 flex items-center justify-center">
                      <feat.Icon />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-base mb-0.5">{feat.title}</p>
                      <p className="text-xs text-[#B88746] uppercase tracking-widest mb-3">{feat.subtitle}</p>
                      <p className="text-[#AAAAAA] text-sm leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Premium vehicle note */}
            <Reveal y={16} delay={0.06}>
              <div className="bg-[#0D0D0D] border border-[#B88746]/15 rounded-xl px-8 py-7 mb-12">
                <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                  Transfer sa realizuje vozidlami tried{" "}
                  <strong className="text-white">Business Class, Business Van a First Class</strong>{" "}
                  — Mercedes-Benz E-Class, S-Class, GLS, V-Class, Hyundai Staria Luxury a ďalšie.
                  Každá cesta prebieha v rovnakom štandarde, bez ohľadu na dennú hodinu
                  alebo vzdialenosť vyzdvihnutia.{" "}
                  <Link
                    href="/nase-vozidla"
                    className="text-[#B88746] hover:underline underline-offset-4"
                  >
                    Prezrieť všetky vozidlá →
                  </Link>
                </p>
              </div>
            </Reveal>

            {/* ─── Conclusion ─── */}
            <Reveal y={20} delay={0.06}>
              <h2 className="mb-4 text-2xl md:text-3xl font-bold text-white tracking-wide">
                Cena nie je len číslo na lístku
              </h2>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed mb-4">
                Kompletná kalkulácia zahŕňa čas strávený prestupmi, riziko zmeškaného spoja,
                náklady na dopravu k zastávke a variabilitu nočného taxi v prípade komplikácií.
              </p>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed mb-4">
                Pre väčšinu bežných situácií — večerné návraty, cestovanie z regiónov,
                skupiny alebo obchodné cesty — vychádza{" "}
                <Link
                  href="/transfer-bratislava-schwechat"
                  className="text-[#B88746] hover:underline underline-offset-4"
                >
                  transfer Bratislava – Schwechat
                </Link>{" "}
                ako hospodárnejšie riešenie, keď sa ráta celkový náklad. Nie iba lístok.
              </p>
              <p className="text-base md:text-lg text-[#CCCCCC] leading-relaxed">
                Relevantná otázka pri výbere dopravy na letisko nie je{" "}
                <em className="text-[#666]">„je to luxus?"</em> — ale{" "}
                <strong className="text-white">
                  „aká je skutočná cena celej cesty?"
                </strong>
              </p>
            </Reveal>

            {/* ─── FAQ ─── */}
            <Reveal y={20} delay={0.08}>
              <div className="mt-16">
                <h2 className="mb-8 text-2xl md:text-3xl font-bold text-white tracking-wide">
                  Časté otázky o transfere Bratislava – Schwechat
                </h2>
                <div className="space-y-3">
                  {faqItems.map((item, i) => (
                    <details key={i} className="group border border-[#1a1a1a] rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none hover:bg-[#0f0f0f] transition-colors">
                        <span className="font-semibold text-white pr-4 text-sm md:text-base">
                          {item.q}
                        </span>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#B88746]/40 flex items-center justify-center text-[#B88746] text-sm group-open:rotate-45 transition-transform duration-200">
                          +
                        </span>
                      </summary>
                      <div className="px-6 pb-5 text-[#AAAAAA] leading-relaxed text-sm border-t border-[#1a1a1a] pt-4">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ─── CTA ─── */}
            <Reveal y={20} delay={0.08}>
              <div className="mt-14 bg-[#0D0D0D] border border-[#B88746]/20 rounded-2xl px-8 py-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  Rezervácia transferu Bratislava – Schwechat
                </h3>
                <p className="text-[#CCCCCC] leading-relaxed mb-3">
                  Pošlite dopyt s trasou, dátumom a počtom cestujúcich. Cenu dostanete
                  obratom — bez registrácie a bez záväzkov.
                </p>
                <p className="text-[#555] text-sm mb-8">
                  Dostupnosť 24 / 7 · Platba kartou, prevodom alebo v hotovosti · Faktúra pre firmu
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/rezervacie">
                    <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-semibold px-10 py-3 rounded-lg w-full sm:w-auto">
                      Odoslať dopyt
                    </Button>
                  </Link>
                  <Link href="/transfer-bratislava-schwechat">
                    <Button
                      variant="outline"
                      className="border-[#333] text-[#CCCCCC] hover:bg-[#1a1a1a] hover:text-white px-10 py-3 rounded-lg w-full sm:w-auto bg-transparent"
                    >
                      Viac o transfere
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>

          </div>
        </article>

      </main>

      <Footer />
    </div>
  )
}
