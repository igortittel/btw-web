import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Reveal } from "@/components/Reveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cenník letiskových transferov Bratislava – Schwechat | By The Wave",
  description:
    "Prehľadný cenník transferov z Bratislavy na letisko Viedeň Schwechat (VIE). Limo od 65 €, Van od 99 €. Fixná cena, príplatky a podmienky prepravy.",
  keywords: [
    "cenník letiskový transfer",
    "cena odvoz schwechat",
    "transfer bratislava viedeň cena",
    "príplatky letiskový transfer",
    "cenník btw",
  ],
  alternates: {
    canonical: "https://btw.sk/cennik-letiskovych-transferov",
  },
  openGraph: {
    title: "Cenník letiskových transferov | By The Wave",
    description:
      "Limo od 65 €, Van od 99 €. Bratislava ↔ Letisko Viedeň Schwechat (VIE).",
    url: "https://btw.sk/cennik-letiskovych-transferov",
  },
}

const surcharges = [
  { service: "Ďalšia adresa", businessClass: "+5 €", businessVan: "+5 €" },
  { service: "Nočný transfer (22:00 – 06:00)", businessClass: "+10 €", businessVan: "+10 €" },
  { service: "Parkovné – odlet", businessClass: "+3 €", businessVan: "+3 €" },
  { service: "Parkovné – prílet", businessClass: "+6 €", businessVan: "+6 €" },
  {
    service: "Vzdialené mestské časti: Devín, Devínska Nová Ves, Záhorská Bystrica, Čunovo",
    businessClass: "+10 €",
    businessVan: "+10 €",
  },
  { service: "Vajnory, Rusovce, Jarovce", businessClass: "+10 €", businessVan: "+10 €" },
  {
    service: "Čakanie nad rámec bezplatného času (každých začatých 30 min)",
    businessClass: "+20 €",
    businessVan: "+25 €",
  },
  {
    service: "Expresná objednávka do 3 hodín pred jazdou (podľa dostupnosti)",
    businessClass: "+10 €",
    businessVan: "+15 €",
  },
  { service: "Detská autosedačka", businessClass: "Zdarma", businessVan: "Zdarma" },
]

const conditions = [
  "Čakanie pri prílete: prvých 60 minút od pristátia zdarma pri sledovaní letu.",
  "Čakanie pri odchode z Bratislavy: prvých 10 minút zdarma.",
  "Storno: viac ako 24 hodín pred jazdou zdarma; menej ako 24 hodín 50 % ceny; nedostavenie sa bez zrušenia 100 % ceny.",
  "Platba: kartou, hotovosťou alebo na faktúru po schválení.",
]

export default function CennikLetiskovychTransferovPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      {/* Hero */}
      <section className="relative w-full h-[60vh] min-h-[420px] flex items-end justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bts-vie.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

        <div className="relative z-10 w-full max-w-3xl px-6 pb-14 text-center">
          <Reveal y={20} delay={0.05}>
            <span className="inline-block text-xs uppercase tracking-widest text-[#B88746] mb-4">
              Bratislava ↔ Letisko Viedeň – Schwechat (VIE)
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Cenník letiskových{" "}
              <span className="text-[#B88746]">transferov</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Price Cards */}
      <section className="py-16 px-6 bg-[#000000]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LIMO */}
            <Reveal y={24}>
              <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#444444] transition-colors">
                <p className="text-xs uppercase tracking-widest text-[#B88746] font-semibold mb-4">Business Class</p>
                <p className="text-6xl font-bold text-white mb-1">65 €</p>
                <p className="text-[#CCCCCC] text-sm mb-6">za jednu jazdu</p>
                <div className="border-t border-[#333333] w-full pt-6 space-y-2">
                  <p className="text-white font-medium">Mercedes-Benz E-Class</p>
                  <p className="text-[#CCCCCC] text-sm">Business Class · 1 – 3 cestujúci</p>
                </div>
              </div>
            </Reveal>

            {/* VAN */}
            <Reveal y={24} delay={0.08}>
              <div className="bg-[#1A1A1A] border border-[#B88746] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#D2A15E] transition-colors">
                <p className="text-xs uppercase tracking-widest text-[#B88746] font-semibold mb-4">Business Van</p>
                <p className="text-6xl font-bold text-white mb-1">99 €</p>
                <p className="text-[#CCCCCC] text-sm mb-6">za jednu jazdu</p>
                <div className="border-t border-[#333333] w-full pt-6 space-y-2">
                  <p className="text-white font-medium">Mercedes-Benz V-Class</p>
                  <p className="text-[#CCCCCC] text-sm">Business Van · štandardne 1 – 7 cestujúcich*</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <p className="mt-4 text-[#666666] text-xs text-center">
              * Kapacita závisí od konfigurácie konkrétneho vozidla a množstva batožiny.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Surcharges Table */}
      <section className="py-16 px-6 bg-[#111111]">
        <div className="max-w-4xl mx-auto">
          <Reveal y={24}>
            <h2 className="text-3xl font-bold text-white mb-10 tracking-wide">Príplatky</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl overflow-hidden border border-[#333333]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1D1D1D]">
                    <th className="text-left px-6 py-4 text-[#CCCCCC] font-medium w-full">Služba</th>
                    <th className="text-center px-6 py-4 text-[#B88746] font-semibold whitespace-nowrap">Business Class</th>
                    <th className="text-center px-6 py-4 text-[#B88746] font-semibold whitespace-nowrap">Business Van</th>
                  </tr>
                </thead>
                <tbody>
                  {surcharges.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t border-[#222222] ${i % 2 === 0 ? "bg-[#111111]" : "bg-[#151515]"}`}
                    >
                      <td className="px-6 py-4 text-[#CCCCCC]">{row.service}</td>
                      <td className="px-6 py-4 text-white text-center font-medium whitespace-nowrap">{row.businessClass}</td>
                      <td className="px-6 py-4 text-white text-center font-medium whitespace-nowrap">{row.businessVan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 px-6 bg-[#000000]">
        <div className="max-w-4xl mx-auto">
          <Reveal y={24}>
            <h2 className="text-3xl font-bold text-white mb-10 tracking-wide">Podmienky prepravy</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="space-y-4">
              {conditions.map((condition, i) => (
                <li key={i} className="flex items-start gap-3 text-[#CCCCCC] text-sm">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#B88746] flex-shrink-0" />
                  {condition}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal y={24}>
            <h2 className="text-2xl font-bold text-white mb-4">Pripravení na vašu cestu</h2>
            <p className="text-[#CCCCCC] mb-8">
              Rezervujte transfer vopred a zabezpečte si pohodlný odvoz na letisko.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/rezervacie">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-8 py-3 rounded-lg">
                  Rezervovať transfer
                </Button>
              </Link>
              <Link href="/transfer-bratislava-schwechat">
                <Button className="border border-[#B88746] text-[#B88746] hover:text-white hover:border-white font-medium px-8 py-3 rounded-lg">
                  Viac o transfere
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
