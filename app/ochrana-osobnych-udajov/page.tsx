import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

type VopSection = {
  num: string
  title: string
  paras: string[]
}

const VOP_SECTIONS: VopSection[] = [
  {
    num: "1",
    title: "Kto spracúva vaše osobné údaje",
    paras: [
      "Prevádzkovateľom osobných údajov je:",
      "By The Wave, s.r.o.",
      "Sídlo: Nové záhrady V, 5835/8, 821 05 Bratislava - mestská časť Ružinov",
      "E-mail: btw@btw.sk",
      "Telefón: +421905102220",
      "Ako prevádzkovateľ zodpovedáme za to, aby bolo spracúvanie vašich osobných údajov vykonávané bezpečne, zákonne a transparentne."
    ],
  },
  {
    num: "2",
    title: "Aké osobné údaje spracúvame",
    paras: [
      "Spracúvame iba osobné údaje, ktoré sú nevyhnutné na poskytovanie našich služieb, najmä v oblasti prepravy osôb a prenájmu vozidiel so šoférom alebo bez šoféra. Ide najmä o identifikačné a kontaktné údaje, ako sú meno a priezvisko, telefónne číslo a e-mailová adresa.",
      "V závislosti od typu objednanej služby spracúvame aj údaje súvisiace s realizáciou prepravy alebo prenájmu vozidla, ako sú miesto vyzdvihnutia a cieľová adresa, dátum a čas jazdy alebo prenájmu, doba trvania služby, počet osôb, množstvo batožiny a zvolené vozidlo.",
      "V prípade potreby môžeme spracúvať aj doplňujúce informácie, ako sú špeciálne požiadavky zákazníka (napríklad detská sedačka, nadrozmerná batožina alebo individuálne požiadavky na vozidlo). Ak je služba fakturovaná, spracúvame aj nevyhnutné fakturačné údaje v rozsahu stanovenom platnými právnymi predpismi.",
    ],
  },
  {
    num: "3",
    title: "Na aký účel údaje spracúvame",
    paras: [
      "Osobné údaje dotknutých osôb spracúvame výlučne na vopred určené, výslovne uvedené a legitímne účely. Primárnym účelom spracúvania je uzatvorenie a plnenie zmluvného vzťahu medzi prevádzkovateľom a zákazníkom, najmä vybavenie rezervácie, organizácia a realizácia prepravy osôb alebo prenájmu vozidiel, ako aj zabezpečenie súvisiacej komunikácie so zákazníkom.",
      "Osobné údaje sú zároveň spracúvané za účelom plnenia zákonných povinností prevádzkovateľa, najmä v oblasti účtovníctva, daňových a archivačných povinností vyplývajúcich z platných právnych predpisov.",
      "V odôvodnených prípadoch môžu byť osobné údaje spracúvané aj na základe oprávneného záujmu prevádzkovateľa, najmä za účelom zabezpečenia riadneho fungovania služieb, ochrany právnych nárokov, riešenia reklamácií a zvyšovania kvality poskytovaných služieb.",
      "Osobné údaje nie sú spracúvané na účely automatizovaného individuálneho rozhodovania ani profilovania v zmysle článku 22 nariadenia GDPR.",
    ],
  },
  {
    num: "4",
    title: "Právny základ spracúvania",
    paras: [
      "Spracúvanie osobných údajov je vykonávané v súlade s článkom 6 nariadenia GDPR a je založené na viacerých právnych základoch v závislosti od účelu spracúvania.",
      "Primárnym právnym základom spracúvania osobných údajov je plnenie zmluvy alebo vykonanie opatrení pred uzatvorením zmluvy na základe žiadosti dotknutej osoby, najmä v súvislosti s rezerváciou, realizáciou prepravy osôb alebo prenájmu vozidiel.",
      "Osobné údaje sú ďalej spracúvané za účelom plnenia zákonných povinností prevádzkovateľa, ktoré mu vyplývajú z osobitných právnych predpisov, najmä v oblasti účtovníctva, daní a archivácie dokumentov.",
      "V odôvodnených prípadoch je spracúvanie osobných údajov vykonávané aj na základe oprávneného záujmu prevádzkovateľa, najmä za účelom zabezpečenia komunikácie so zákazníkmi, ochrany právnych nárokov, prevencie zneužitia služieb a zabezpečenia bezpečnosti poskytovaných služieb.",
      "Ak je to potrebné, osobné údaje môžu byť spracúvané aj na základe výslovného súhlasu dotknutej osoby, najmä v prípade marketingovej komunikácie. Udelený súhlas je možné kedykoľvek odvolať bez vplyvu na zákonnosť spracúvania vykonaného pred jeho odvolaním.",
    ],
  },
  {
    num: "5",
    title: "Doba uchovávania údajov",
    paras: [
      "Osobné údaje dotknutých osôb uchovávame iba po dobu nevyhnutnú na splnenie účelov, na ktoré boli spracúvané, v súlade so zásadou minimalizácie uchovávania podľa nariadenia GDPR.",
      "Osobné údaje spracúvané na účely plnenia zmluvného vzťahu uchovávame počas trvania tohto vzťahu a následne po dobu nevyhnutnú na ochranu právnych nárokov prevádzkovateľa, ako aj po dobu vyžadovanú platnými právnymi predpismi.",
      "Osobné údaje spracúvané na základe zákonnej povinnosti uchovávame po dobu stanovenú osobitnými právnymi predpismi, najmä v oblasti účtovníctva, daní a archivácie dokumentov.",
      "V prípade, ak sú osobné údaje spracúvané na základe súhlasu dotknutej osoby, uchovávame ich po dobu trvania tohto súhlasu, pričom po jeho odvolaní sú osobné údaje bezodkladne vymazané alebo anonymizované, pokiaľ neexistuje iný zákonný dôvod na ich ďalšie spracúvanie.",
    ],
  },
  {
    num: "6",
    title: "Kto má k údajom prístup",
    paras: [
      "Prístup k osobným údajom majú výlučne osoby, ktoré sú oprávnené a poučené o povinnostiach vyplývajúcich zo spracúvania osobných údajov v zmysle platných právnych predpisov.",
      "Osobné údaje môžu byť v nevyhnutnom rozsahu sprístupnené interným pracovníkom prevádzkovateľa, ako aj vodičom alebo zmluvným partnerom zabezpečujúcim realizáciu prepravy alebo prenájmu vozidiel, a to výlučne v rozsahu potrebnom na riadne poskytnutie objednanej služby.",
      "Prístup k osobným údajom môžu mať tiež technickí a IT partneri prevádzkovateľa, ktorí zabezpečujú prevádzku, údržbu a technickú podporu informačných systémov a rezervačného systému. Tieto subjekty spracúvajú osobné údaje výlučne na základe zmluvného vzťahu s prevádzkovateľom a v súlade s jeho pokynmi.",
      "Osobné údaje nie sú poskytované tretím stranám na marketingové účely ani inak neoprávnene sprístupňované.",
    ],
  },
  {
    num: "7",
    title: "Zabezpečenie osobných údajov",
    paras: [
      "Prevádzkovateľ prijal a udržiava primerané technické a organizačné opatrenia s cieľom zabezpečiť ochranu osobných údajov pred ich náhodným alebo neoprávneným sprístupnením, zmenou, zničením, stratou alebo iným neoprávneným spracúvaním, a to v súlade s článkom 32 nariadenia GDPR.",
      "Uvedené opatrenia zahŕňajú najmä zabezpečenie informačných systémov a technickej infraštruktúry, riadenie prístupových práv k osobným údajom výlučne pre oprávnené osoby, používanie primeraných bezpečnostných mechanizmov pri elektronickej komunikácii a prenose údajov, ako aj povinnosť mlčanlivosti osôb, ktoré prichádzajú do styku s osobnými údajmi.",
      "Prevádzkovateľ zároveň zabezpečuje, aby zmluvní partneri a sprostredkovatelia spracúvali osobné údaje výlučne na základe jeho pokynov a v súlade s uzatvorenými zmluvnými dojednaniami o spracúvaní osobných údajov.",
      "Primeranosť a účinnosť prijatých bezpečnostných opatrení prevádzkovateľ pravidelne prehodnocuje s ohľadom na rozsah, povahu a účel spracúvania osobných údajov, ako aj na aktuálne riziká spojené s ich spracúvaním.",
      "Tieto opatrenia zahŕňajú najmä zabezpečenie informačných systémov a technickej infraštruktúry, obmedzenie prístupu k osobným údajom výlučne na oprávnené osoby, používanie primeraných bezpečnostných mechanizmov pri elektronickej komunikácii, ako aj pravidelnú kontrolu a vyhodnocovanie prijatých bezpečnostných opatrení.",
      "Prevádzkovateľ priebežne posudzuje primeranosť prijatých opatrení s ohľadom na rozsah, povahu a účel spracúvania osobných údajov, ako aj na aktuálne riziká spojené s ich spracúvaním.",
    ],
  },
  {
    num: "8",
    title: "Práva dotknutej osoby",
    paras: [
      "Dotknutá osoba má v súlade s nariadením GDPR právo získať od prevádzkovateľa potvrdenie o tom, či sú jej osobné údaje spracúvané, a v prípade kladnej odpovede má právo na prístup k týmto osobným údajom a k informáciám o ich spracúvaní.",
      "Dotknutá osoba má právo na opravu nesprávnych alebo neúplných osobných údajov, ako aj právo požadovať vymazanie osobných údajov, ak sú splnené podmienky ustanovené nariadením GDPR, najmä ak osobné údaje už nie sú potrebné na účely, na ktoré boli spracúvané, alebo ak bol odvolaný súhlas so spracúvaním.",
      "Za podmienok stanovených nariadením GDPR má dotknutá osoba právo požadovať obmedzenie spracúvania osobných údajov, právo na prenosnosť osobných údajov k inému prevádzkovateľovi, ako aj právo namietať proti spracúvaniu osobných údajov založenému na oprávnenom záujme prevádzkovateľa.",
      "Dotknutá osoba má zároveň právo podať sťažnosť dozornému orgánu, ktorým je Úrad na ochranu osobných údajov Slovenskej republiky, ak sa domnieva, že spracúvanie jej osobných údajov je v rozpore s platnými právnymi predpismi.",
    ],
  },
  {
    num: "9",
    title: "Cookies",
    paras: [
      "Prevádzkovateľ používa na webovej stránke cookies a obdobné technológie výlučne v rozsahu a spôsobom, ktorý je v súlade s platnými právnymi predpismi. Nastavenia používania cookies, vrátane udelenia alebo odvolania súhlasu, sú riešené prostredníctvom samostatnej cookie lišty zobrazenej pri návšteve webovej stránky.",
      "Podrobné informácie o jednotlivých typoch cookies, účeloch ich používania a možnostiach správy súhlasu sú dostupné priamo v rámci cookie lišty.",
    ],
  },
  {
    num: "10",
    title: "Kontakt",
    paras: [
      "Ak máte akékoľvek otázky týkajúce sa spracúvania osobných údajov, kontaktujte nás:",
      "E-mail: btw@btw.sk",
      "Telefón: +421905102220",
      "Radi vám poskytneme všetky potrebné informácie.",
    ],
  },
]

function slugify(num: string) {
  return `clanok-${num}`
}

function renderParagraph(p: string, idx: number) {
  const isBullet = /^[a-z]\)/.test(p.trim())
  if (isBullet) {
    return (
      <li key={idx} className="text-[#CCCCCC] leading-relaxed">
        {p.trim()}
      </li>
    )
  }

  const m = p.match(/^(\d+\.\d+(?:\.\d+)*\.)\s*(.*)$/)
  if (m) {
    return (
      <p key={idx} className="text-[#CCCCCC] leading-relaxed">
        <span className="text-white font-semibold">{m[1]}</span> {m[2]}
      </p>
    )
  }

  // Highlight company name
  if (p.trim() === "By The Wave, s.r.o.") {
    return (
      <p key={idx} className="text-white font-semibold leading-relaxed">
        {p.trim()}
      </p>
    )
  }

  return (
    <p key={idx} className="text-[#CCCCCC] leading-relaxed">
      {p}
    </p>
  )
}

export default function VseobecneObchodnePodmienkyPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white" id="top">
      <ScrollToTop />
      <Header />

      <section className="pt-32 pb-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white text-center">Ochrana osobných údajov</h1>
          <p className="text-[#CCCCCC] text-center mt-4 max-w-3xl mx-auto leading-relaxed">
            Vaše súkromie berieme vážne. Na tejto stránke nájdete prehľadné informácie o tom, aké osobné údaje spracúvame, prečo ich potrebujeme a ako ich chránime, v súlade s nariadením GDPR.
          </p>

          {/* Content */}
          <div className="mt-12 space-y-8">
            {VOP_SECTIONS.map((s) => {
              const bullets = s.paras.filter((p) => /^[a-z]\)/.test(p.trim()))
              const rest = s.paras.filter((p) => !/^[a-z]\)/.test(p.trim()))

              return (
                <div
                  key={s.num}
                  id={slugify(s.num)}
                  className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-6 md:p-8 scroll-mt-28"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    <span className="text-[#B88746]">{s.num}.</span> {s.title}
                  </h2>

                  <div className="mt-6 space-y-4">{rest.map((p, idx) => renderParagraph(p, idx))}</div>

                  {bullets.length > 0 && (
                    <ul className="mt-6 space-y-2 list-none pl-0">
                      {bullets.map((p, idx) => renderParagraph(p, 1000 + idx))}
                    </ul>
                  )}

                  <div className="mt-6">
                    <a href="#top" className="text-sm text-[#CCCCCC] hover:text-white underline">
                      Späť hore
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
