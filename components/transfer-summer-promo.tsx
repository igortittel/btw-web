import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/Reveal"
import type { PromoData } from "@/lib/promo"

interface Props {
  promo: PromoData
}

export function TransferSummerPromo({ promo }: Props) {
  if (!promo.active) return null

  return (
    <section className="relative py-0 bg-[#0A0A0A] overflow-hidden">
      {/* Gold accent line top */}
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#B88746] to-transparent" />

      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <Reveal y={20} delay={0.03}>
            <div className="text-center mb-12">
              <span className="inline-block rounded-full border border-[#B88746]/50 bg-[#B88746]/10 px-5 py-1.5 text-xs uppercase tracking-[0.2em] text-[#B88746] mb-5">
                ✦ Letná akcia ✦
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-white">
                Špeciálne ceny letných transferov
              </h2>
              <p className="mt-2 text-sm text-[#666666] tracking-wide">
                <span className="block sm:inline">{promo.validFrom} – {promo.validUntil}</span>
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">Bratislava – Schwechat (VIE)</span>
              </p>
            </div>
          </Reveal>

          {/* Two vehicle cards */}
          <Reveal y={24} delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-5">

              {/* E-Class card */}
              <div className="rounded-2xl border border-[#B88746]/20 bg-[#111111] overflow-hidden">
                {/* Card top accent */}
                <div className="h-[2px] bg-gradient-to-r from-[#B88746]/60 to-transparent" />
                <div className="p-5 sm:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-[#666666] mb-1">Business limuzína</div>
                      <div className="text-2xl font-bold text-white">E-Class</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-[#555555] mb-1">Bežne</div>
                      <div className="text-base text-[#555555] line-through">{promo.eClass.regular} €</div>
                    </div>
                  </div>

                  {/* Price rows */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-[#777777]">Odchod</div>
                        <div className="text-xs text-[#444444] mt-0.5">Bratislava → Schwechat</div>
                      </div>
                      <div className="text-2xl sm:text-4xl font-bold text-[#B88746] whitespace-nowrap">{promo.eClass.odchod} €</div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-[#777777]">Príchod</div>
                        <div className="text-xs text-[#444444] mt-0.5">Schwechat → Bratislava</div>
                      </div>
                      <div className="text-2xl sm:text-4xl font-bold text-[#B88746] whitespace-nowrap">
                        {promo.eClass.prichod.toFixed(2).replace(".", ",")} €
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* V-Class card */}
              <div className="rounded-2xl border border-[#B88746]/20 bg-[#111111] overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-[#B88746]/60 to-transparent" />
                <div className="p-5 sm:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-[#666666] mb-1">Business van</div>
                      <div className="text-2xl font-bold text-white">V-Class</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-[#555555] mb-1">Bežne</div>
                      <div className="text-base text-[#555555] line-through">{promo.vClass.regular} €</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-[#777777]">Odchod</div>
                        <div className="text-xs text-[#444444] mt-0.5">Bratislava → Schwechat</div>
                      </div>
                      <div className="text-2xl sm:text-4xl font-bold text-[#B88746] whitespace-nowrap">{promo.vClass.odchod} €</div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-xs uppercase tracking-[0.12em] text-[#777777]">Príchod</div>
                        <div className="text-xs text-[#444444] mt-0.5">Schwechat → Bratislava</div>
                      </div>
                      <div className="text-2xl sm:text-4xl font-bold text-[#B88746] whitespace-nowrap">
                        {promo.vClass.prichod.toFixed(2).replace(".", ",")} €
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Reveal>

          {/* CTA */}
          <Reveal y={16} delay={0.18}>
            <div className="mt-10 flex flex-col items-center gap-3">
              <Link href="/rezervacie">
                <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-semibold px-12 py-3 rounded-lg text-base">
                  Rezervovať so zľavou
                </Button>
              </Link>
              <p className="text-xs text-[#444444] text-center sm:text-left">
                Fixná cena · Žiadne skryté poplatky
              </p>
            </div>
          </Reveal>

        </div>
      </div>

      {/* Gold accent line bottom */}
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#B88746] to-transparent" />
    </section>
  )
}
