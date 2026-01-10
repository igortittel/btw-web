import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontakt - BY THE WAVE Executive Mobility",
  description:
    "Kontaktujte nás pre prenájom luxusných vozidiel a VIP prepravu na Slovensku. Profesionálne služby mobility, Executive Mobility, Mercedes, BMW prenájom.",
  keywords: [
    "kontakt prenájom vozidiel",
    "BY THE WAVE kontakt",
    "executive mobility kontakt",
    "prenájom áut Bratislava kontakt",
    "VIP preprava kontakt",
  ],
  openGraph: {
    title: "Kontakt - BY THE WAVE Executive Mobility",
    description: "Kontaktujte nás pre prenájom luxusných vozidiel a VIP prepravu na Slovensku.",
    url: "https://bythewave.sk/kontakt",
  },
  alternates: {
    canonical: "https://bythewave.sk/kontakt",
  },
}

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollToTop />
      <Header />

      <section className="py-20 px-6 pt-32 bg-[#111111]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 tracking-wide text-white">KONTAKT</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-6">
              <h2 className="text-sm tracking-widest text-[#B88746] mb-3 uppercase">Kontaktné údaje</h2>
              <p className="text-white font-semibold">BY THE WAVE, s.r.o.</p>
              <p className="text-[#CCCCCC] mt-2 leading-relaxed">
                Nové záhrady V, 5835/8<br />
                821 05, Bratislava - mestská časť Ružinov
              </p>
              <p className="text-[#CCCCCC] mt-2 leading-relaxed">
                <b>email:</b> btw@btw.sk<br />
                <b>tel:</b> +421 905 102 220
              </p>
            </div>

            <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-6">
              <h2 className="text-sm tracking-widest text-[#B88746] mb-3 uppercase">Fakturačné údaje</h2>
              <p className="text-[#CCCCCC] leading-relaxed">
                <span className="text-white">IČO:</span> 44235755<br />
                <span className="text-white">DIČ:</span> 2022643403<br />
                <span className="text-white">IČ DPH:</span> SK2022643403, podľa §4, registrácia od 20.8.2008
              </p>
            </div>
          </div>
          <div className="px-6 py-4">
            <h2 className="text-sm tracking-widest text-[#B88746] uppercase">Kde nás nájdete</h2>
            <p className="text-[#CCCCCC] mt-2">Trenčianska 56/A, 821 09 Bratislava</p>
          </div>
          <div className="relative w-full h-[320px] md:h-[420px]">
            <iframe
              title="BY THE WAVE, s.r.o. – mapa"
              style={{ filter: "invert(90%)" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.808605632282!2d17.141596299999996!3d48.152494999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c898829784941%3A0x29c994649dd6b7f2!2sBy%20The%20Wave%2C%20s.r.o.!5e0!3m2!1sen!2ssk!4v1767477794380!5m2!1sen!2ssk&output=embed"
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  )
}