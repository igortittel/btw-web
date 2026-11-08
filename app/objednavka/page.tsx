import type { Metadata } from "next"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureCard } from "@/components/feature-card"
import { OrderForm } from "@/components/order-form/OrderForm"
import { ObjednavkaGate } from "@/components/order-form/ObjednavkaGate"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Reveal } from "@/components/Reveal"

export const metadata: Metadata = {
  title: "Objednávka transferu (beta) | By The Wave",
  description:
    "Beta verzia objednávkového formulára s okamžitým výpočtom ceny — skryté za heslom.",
  // Private beta — do not index until public launch
  robots: { index: false, follow: false },
}

export default function OrderPage() {
  return (
    <ObjednavkaGate>
      <div className="min-h-screen bg-[#000000] text-white">
        <ScrollToTop />
        <Header />

      <section className="py-4 px-6 pt-32 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Reveal y={16} delay={0.02}>
              <span className="inline-block text-xs uppercase tracking-widest text-[#B88746] mb-4">
                Objednávka transferu · 3 kroky
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
                Zadajte trasu —{" "}
                <span className="block text-[#B88746]">cenu vidíte hneď</span>
              </h1>
            </Reveal>
            <Reveal y={16} delay={0.08}>
              <p className="text-[#CCCCCC] mt-6 leading-relaxed max-w-2xl mx-auto">
                Žiadne čakanie na mail. Vyplňte trasu a dátum, my spočítame vzdialenosť
                a cenu pre každú triedu vozidla. Objednávka v 3 krátkych krokoch.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Reveal y={12} delay={0.12}>
        <div className="max-w-6xl mx-auto px-6" aria-hidden="true">
          <div className="h-px w-full bg-white/10" />
        </div>
      </Reveal>

      <OrderForm />

      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <Reveal y={16} delay={0.02}>
            <h2 className="text-4xl font-bold text-center mb-16 tracking-wide text-white">
              PREČO OBJEDNAŤ U NÁS
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Reveal y={16} delay={0.06}>
              <FeatureCard
                icon={
                  <Image src="/images/money-icon.svg" alt="Cena" width={32} height={32} className="w-8 h-8" />
                }
                title="Transparentná cena"
                description="Cenu za vašu trasu uvidíte pred odoslaním. Žiadne skryté poplatky."
              />
            </Reveal>
            <Reveal y={16} delay={0.1}>
              <FeatureCard
                icon={
                  <Image src="/images/time-icon.svg" alt="Čas" width={32} height={32} className="w-8 h-8" />
                }
                title="Objednávka za 3 kroky"
                description="Minimum polí, maximálny komfort. Hotovo za 90 sekúnd."
              />
            </Reveal>
            <Reveal y={16} delay={0.14}>
              <FeatureCard
                icon={
                  <Image src="/images/diamond-icon.svg" alt="Vozidlá" width={32} height={32} className="w-8 h-8" />
                }
                title="Výber vozidla"
                description="Business Class, Business Van alebo First Class — porovnajte ceny v jednom kroku."
              />
            </Reveal>
            <Reveal y={16} delay={0.18}>
              <FeatureCard
                icon={
                  <Image src="/images/comfort-icon.svg" alt="Komfort" width={32} height={32} className="w-8 h-8" />
                }
                title="Komfort BTW"
                description="Profesionálny šofér, pomoc s batožinou, flexibilný storno."
              />
            </Reveal>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </ObjednavkaGate>
  )
}
