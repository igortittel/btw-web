import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

type VopSection = {
  num: string
  title: string
  part: string
  paras: string[]
}

const VOP_SECTIONS: VopSection[] = [
  {
    num: "1",
    title: "ZÁKLADNÉ USTANOVENIA",
    part: "VŠEOBECNÁ ČASŤ",
    paras: [
      "1.1. Toto je úplné znenie Všeobecných obchodných podmienok (ďalej len „VOP“) spoločnosti BY THE WAVE, s.r.o., so sídlom Nové záhrady V 5835/8, 821 05 Bratislava - mestská časť Ružinov, IČO:",
      "44235755, DIČ: 2022643403, IČ DPH: SK2022643403, registrácia: Obchodný register Mestského súdu Bratislava III, oddiel: Sro, vložka č. 53050/B, ktoré nadobúdajú účinnosť dňom 1.1.2025 (ďalej len „Nájomca“). VOP sú platné a účinné od uvedeného dňa, mesiaca a roka a tvoria neoddeliteľnú súčasť Zmluvy.",
      "1.2. VOP upravujú vzťahy, práva a povinnosti medzi Nájomcom a Podnájomcom vznikajúce na základe alebo v súvislosti so Zmluvou, ako aj všetky vzťahy vznikajúce v súvislosti s využívaním Portálu Nájomcu a to v rozsahu, v akom Nájomca vystupuje ako zmluvná strana a zároveň prevádzkovateľ Portálu. Nájomca vystupuje ako zmluvná strana v prípade poskytnutia Služieb alebo prenájmu Vozidla, ktorý je vlastníctvom Nájomcu alebo Vozidla, ku ktorému má Nájomca právo dispozície. V ostatných prípadoch Nájomca vystupuje ako prevádzkovateľ Portálu pre sprostredkovanie ponúk a služieb uvedených na Portáli.",
      "1.3. Tieto VOP sú vypracované v súlade s platnými právnymi predpismi Slovenskej republiky, najmä nie však výlučne so zákonom č. 513/1991 Zb. Obchodný zákonník v znení neskorších predpisov (ďalej len „Obchodný zákonník“), so zákonom č. 40/1964 Zb. Občiansky zákonník v znení neskorších predpisov (ďalej len „Občiansky zákonník“), so zákonom č. 250/2007 Z. z. o ochrane spotrebiteľa v znení neskorších predpisov (ďalej len „Zákon o ochrane spotrebiteľa“).",
      "1.4. V prípade akéhokoľvek nesúladu medzi ustanoveniami VOP a Zmluvou platí, že za rozhodujúce sa považujú ustanovenia Zmluvy. K ústnej dohode a dojednaniam sa v týchto prípadoch neprihliada.",
      "1.5. V prípade nesúladu medzi ustanoveniami Zmluvy a VOP platí, že ustanovenia Zmluvy majú prednosť.",
      "1.6. VOP sú vyhotovené v slovenskom jazyku a sú verejne prístupné na internetovej stránke Nájomcu.",
      "1.7. Podnájomca vyhlasuje, že sa oboznámil s obsahom VOP pred uzavretím Zmluvy a súhlasí s nimi.",
      "1.8. VOP sa uplatnia aj na prípady, keď Podnájomca objedná Služby Nájomcu prostredníctvom Portálu.",
      "1.9. VOP sú súčasťou Zmluvy a tvoria jej neoddeliteľnú prílohu.",
      "1.10. Nájomca si vyhradzuje právo VOP jednostranne meniť a dopĺňať. Zmeny VOP sú účinné dňom ich zverejnenia na webovej stránke Nájomcu, ak nie je uvedené inak.",
      "1.11. Zmluvné strany sa dohodli, že zmeny VOP sa vzťahujú aj na Zmluvy uzatvorené pred zmenou VOP, ak Podnájomca so zmenou VOP súhlasí alebo ak Podnájomca pokračuje v užívaní Predmetu zmluvy po účinnosti zmeny VOP.",
      "1.12. Tieto VOP sú vypracované s cieľom jasne a zrozumiteľne upraviť podmienky prenájmu a poskytovania služieb.",
      "1.13. Podnájomca berie na vedomie, že Nájomca môže na Portáli uvádzať aj ponuky tretích osôb a v takom prípade Nájomca nenesie zodpovednosť za plnenie povinností týchto tretích osôb.",
      "1.14. VOP môžu obsahovať aj osobitné ustanovenia pre jednotlivé druhy Služieb a typy vozidiel.",
      "1.15. Nájomca a Podnájomca sa zaväzujú riešiť spory prednostne dohodou.",
      "1.16. Ak niektoré ustanovenie VOP bude neplatné alebo nevykonateľné, ostatné ustanovenia zostávajú platné a účinné.",
      "1.17. Nájomca vyhlasuje, že poskytuje služby a prenájom vozidiel v súlade s platnými právnymi predpismi.",
      "1.18. Podnájomca vyhlasuje, že je oprávnený uzatvoriť Zmluvu a že má právnu spôsobilosť na jej uzavretie.",
      "1.19. Podnájomca berie na vedomie, že podpisom Zmluvy alebo objednaním Služby potvrdzuje súhlas s VOP.",
      "1.20. VOP sú dostupné aj na vyžiadanie v sídle Nájomcu.",
    ],
  },
  {
    num: "2",
    title: "DEFINÍCIE",
    part: "VŠEOBECNÁ ČASŤ",
    paras: [
      "2.1. Na účely týchto VOP majú nižšie uvedené pojmy nasledujúci význam:",
      "a) „Nájomca“ – spoločnosť BY THE WAVE, s.r.o.",
      "b) „Podnájomca“ – fyzická osoba alebo právnická osoba, ktorá uzatvorila Zmluvu s Nájomcom alebo si objednala Služby.",
      "c) „Zmluva“ – podnájomná zmluva alebo iná zmluva uzatvorená medzi Nájomcom a Podnájomcom.",
      "d) „Predmet zmluvy“ – vozidlo alebo iný predmet, ktorý Nájomca prenecháva Podnájomcovi do užívania.",
      "e) „Portál“ – internetová stránka Nájomcu určená na prezentáciu ponúk a sprostredkovanie Služieb.",
      "f) „Služby“ – služby poskytované Nájomcom, najmä preprava osôb, letiskové transfery, prenájom vozidiel s vodičom a ďalšie.",
      "2.2. Ďalšie pojmy používané vo VOP sa vykladajú v zmysle príslušných právnych predpisov.",
    ],
  },
  {
    num: "3",
    title: "KONANIE A PODPISOVANIE",
    part: "VŠEOBECNÁ ČASŤ",
    paras: [
      "3.1. Za Nájomcu je oprávnený konať konateľ alebo iná osoba poverená v súlade s právnymi predpismi.",
      "3.2. Podnájomca je povinný pri uzatváraní Zmluvy uviesť pravdivé a úplné údaje.",
      "3.3. Podnájomca berie na vedomie, že podpisom Zmluvy alebo odoslaním objednávky potvrdzuje súhlas s VOP.",
      "3.4. Ak Podnájomca koná prostredníctvom splnomocnenca, je povinný predložiť platné písomné splnomocnenie.",
    ],
  },
  {
    num: "4",
    title: "PREDMET ZMLUVY",
    part: "OSOBITNÁ ČASŤ",
    paras: [
      "4.1. Predmetom Zmluvy je dočasné prenechanie Predmetu zmluvy do užívania Podnájomcovi za odplatu alebo poskytnutie Služieb.",
      "4.2. Podmienky prenájmu a poskytovania Služieb sú špecifikované v Zmluve, objednávke alebo potvrdení rezervácie.",
      "4.3. Podnájomca je povinný používať Predmet zmluvy riadne, v súlade s jeho určením a pokynmi Nájomcu.",
      "4.4. Podnájomca nesmie Predmet zmluvy ďalej prenechať do užívania tretej osobe bez písomného súhlasu Nájomcu.",
      "4.5. Podnájomca zodpovedá za škody spôsobené na Predmete zmluvy počas doby užívania.",
      "4.6. Podrobné podmienky odovzdania a prevzatia Predmetu zmluvy môžu byť uvedené v Cenníku alebo v prílohách Zmluvy.",
    ],
  },
  {
    num: "5",
    title: "CENA, DEPOZIT A PLATOBNÉ PODMIENKY",
    part: "OSOBITNÁ ČASŤ",
    paras: [
      "5.1. Cena za prenájom Predmetu zmluvy alebo za poskytnutie Služieb je stanovená podľa aktuálneho cenníka Nájomcu alebo podľa individuálnej dohody.",
      "5.2. Podnájomca je povinný uhradiť cenu v súlade so Zmluvou, objednávkou alebo faktúrou.",
      "5.3. Nájomca je oprávnený požadovať depozit (kauciu) v sume uvedenej v Zmluve alebo cenníku.",
      "5.4. Depozit slúži na zabezpečenie pohľadávok Nájomcu, najmä náhrady škody, nedoplatkov a poplatkov.",
      "5.5. Depozit môže byť po ukončení Zmluvy vrátený po odpočítaní oprávnených nárokov Nájomcu.",
      "5.6. Pri omeškaní s platbou je Nájomca oprávnený účtovať úroky z omeškania a prípadné zmluvné pokuty podľa Zmluvy.",
    ],
  },
  {
    num: "6",
    title: "SLUŽBY",
    part: "OSOBITNÁ ČASŤ",
    paras: [
      "6.1. Nájomca poskytuje najmä služby prepravy osôb, letiskové transfery, prenájom vozidiel s vodičom a ďalšie služby uvedené na Portáli.",
      "6.2. Podrobnosti poskytovaných Služieb, vrátane rozsahu, cien a podmienok, sú uvedené na Portáli alebo v individuálnej dohode.",
      "6.3. Nájomca sa zaväzuje poskytnúť Služby s odbornou starostlivosťou.",
      "6.4. Podnájomca je povinný poskytnúť Nájomcovi potrebnú súčinnosť.",
    ],
  },
  {
    num: "7",
    title: "UKONČENIE ZMLUVY A VRÁTENIE PREDMETU ZMLUVY",
    part: "OSOBITNÁ ČASŤ",
    paras: [
      "7.1. Zmluva môže byť ukončená uplynutím dohodnutej doby, dohodou zmluvných strán, odstúpením alebo výpoveďou podľa Zmluvy a VOP.",
      "7.2. Podnájomca je povinný vrátiť Predmet zmluvy v dohodnutom čase a mieste, v stave zodpovedajúcom riadnemu užívaniu.",
      "7.3. Pri vrátení Predmetu zmluvy sa spíše preberací protokol, v ktorom sa zaznamenajú zistené škody a nedostatky.",
      "7.4. Ak Podnájomca neposkytne súčinnosť pri odovzdaní, Nájomca je oprávnený vykonať obhliadku a spísať protokol bez účasti Podnájomcu.",
    ],
  },
  {
    num: "8",
    title: "Inflačná doložka",
    part: "OSOBITNÁ ČASŤ",
    paras: [
      "8.1. Zmluvné strany sa dohodli, že Nájomca je oprávnený jednostranne jedenkrát (1x) ročne zvýšiť odplatu za užívanie Predmetu zmluvy počas celej doby nájmu o mieru inflácie za predchádzajúci kalendárny rok oficiálne vyhlásenú Štatistickým úradom Slovenskej republiky, a to nasledovne:",
      "a) Odplata platná k 31.decembru kalendárneho roka sa bude k 1.januáru nasledujúceho kalendárneho roka zvyšovať v súlade s vyhlásenou mierou inflácie Štatistickým úradom Slovenskej republiky za predchádzajúco kalendárny rok;",
      "b) Doplatok k už zaplatenej odplate za užívanie Predmetu zmluvy za uplynulý kalendárny rok bude Podnájomcovi spätne doúčtovaný v súlade s vyhlásenou mierou inflácie Štatistickým úradom Slovenskej republiky za predchádzajúci kalendárny rok.",
      "8.2. Pri úprave odplaty bude Nájomca vychádzať z oficiálnych údajov o ročnej miere inflácie meranej indexom spotrebiteľských cien publikovaných Štatistickým úradom Slovenskej republiky na jeho oficiálnej webstránke.",
      "8.3. Nájomca doručí Podnájomcovi písomné oznámenie o zvýšení odplaty a toto zvýšenie je povinný podložiť podkladom zo Štatistického úradu Slovenskej republiky.",
      "8.4. Doúčtovanie zvýšenej odplaty je splatné podľa vystavenej faktúry a Podnájomca je povinný doplatiť rozdiel odplaty na účet Nájomcu.",
    ],
  },
  {
    num: "9",
    title: "Záverečné vyúčtovanie",
    part: "OSOBITNÁ ČASŤ",
    paras: [
      "9.1. Záverečným vyúčtovaním sa rozumie vzájomné finančné vyúčtovanie medzi Nájomcom a Podnájomcom, ktoré Nájomca vykoná pri riadnom a pri predčasnom ukončení Zmluvy potom, ako sú všetky platby a nároky zmluvných strán vysporiadané.",
      "9.2. Nájomca je oprávnený započítať svoje pohľadávky voči Podnájomcovi s depozitom.",
      "9.3. V prípade nedoplatku je Podnájomca povinný uhradiť rozdiel podľa vyúčtovania.",
    ],
  },
  {
    num: "10",
    title: "DÔVERNÉ INFORMÁCIE",
    part: "ZÁVEREČNÁ ČASŤ",
    paras: [
      "10.1. Zmluvné strany sa zaväzujú zachovávať mlčanlivosť o dôverných informáciách, ktoré sa dozvedeli v súvislosti so Zmluvou.",
      "10.2. Povinnosť mlčanlivosti trvá aj po ukončení Zmluvy.",
    ],
  },
  {
    num: "11",
    title: "OZNAMOVANIE A DORUČOVANIE",
    part: "ZÁVEREČNÁ ČASŤ",
    paras: [
      "11.1. Oznámenia a doručovanie medzi zmluvnými stranami sa vykonáva spôsobom uvedeným v Zmluve alebo podľa VOP.",
      "11.2. Za doručené sa považuje aj oznámenie doručené elektronicky na kontaktnú adresu.",
    ],
  },
  {
    num: "12",
    title: "ZODPOVEDNOSŤ PODNÁJOMCU A NÁHRADA ŠKODY",
    part: "ZÁVEREČNÁ ČASŤ",
    paras: [
      "12.1. Podnájomca zodpovedá za škodu spôsobenú na Predmete zmluvy počas doby užívania.",
      "12.2. Podnájomca je povinný nahradiť škodu v rozsahu určenom podľa Zmluvy, VOP a právnych predpisov.",
    ],
  },
  {
    num: "13",
    title: "VŠEOBECNÉ A ZÁVEREČNÉ USTANOVENIA",
    part: "ZÁVEREČNÁ ČASŤ",
    paras: [
      "13.1. Tieto VOP nadobúdajú účinnosť dňom 1.1.2025.",
      "13.2. Právne vzťahy neupravené Zmluvou a VOP sa riadia príslušnými právnymi predpismi Slovenskej republiky.",
      "13.3. Spory vzniknuté zo Zmluvy a VOP budú riešené prednostne dohodou, inak príslušným súdom Slovenskej republiky.",
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

  return (
    <p key={idx} className="text-[#CCCCCC] leading-relaxed">
      {p}
    </p>
  )
}

export default function VseobecneObchodnePodmienkyPage() {
  const parts = Array.from(new Set(VOP_SECTIONS.map((s) => s.part).filter(Boolean)))

  return (
    <div className="min-h-screen bg-[#000000] text-white" id="top">
      <ScrollToTop />
      <Header />

      <section className="pt-32 pb-20 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-white text-center">Všeobecné obchodné podmienky</h1>
          <p className="text-[#CCCCCC] text-center mt-4 max-w-3xl mx-auto leading-relaxed">
            Všeobecné obchodné podmienky spoločnosti BY THE WAVE, s.r.o. (účinné od 1.1.2025).
          </p>

          {/* Content */}
          <div className="mt-12 space-y-10">
            {parts.map((part) => (
              <div key={part} id={part.toLowerCase().replace(/\s+/g, "-")} className="space-y-8">
                <h2 className="text-2xl font-bold text-white tracking-wide">{part}</h2>

                {VOP_SECTIONS.filter((s) => s.part === part).map((s) => {
                  const bullets = s.paras.filter((p) => /^[a-z]\)/.test(p.trim()))
                  const rest = s.paras.filter((p) => !/^[a-z]\)/.test(p.trim()))

                  return (
                    <div
                      key={s.num}
                      id={slugify(s.num)}
                      className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-6 md:p-8 scroll-mt-28"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-white">
                        <span className="text-[#B88746]">{s.num}.</span> {s.title}
                      </h3>

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
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
