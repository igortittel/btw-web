import type { Metadata } from "next"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Reveal } from "@/components/Reveal"
import { BlogGrid } from "@/components/blog-grid"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tipy na transfer na letisko, prenájom vozidiel v Bratislave a praktické rady pre cestovanie po Slovensku. Odborné články od tímu By The Wave.",
  keywords: [
    "blog transfer letisko",
    "prenájom vozidiel Bratislava tipy",
    "transfer Bratislava Schwechat",
    "cestovanie Slovensko",
    "privátna preprava",
    "luxusný van prenájom",
  ],
  alternates: {
    canonical: "https://btw.sk/blog",
  },
  openGraph: {
    title: "Blog | By The Wave",
    description:
      "Tipy na transfer na letisko, prenájom vozidiel v Bratislave a praktické rady pre cestovanie po Slovensku.",
    url: "https://btw.sk/blog",
    type: "website",
  },
  robots: { index: true, follow: true },
}

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Blog | By The Wave",
  description:
    "Tipy na transfer na letisko, prenájom vozidiel v Bratislave a praktické rady pre cestovanie po Slovensku.",
  url: "https://btw.sk/blog",
  publisher: {
    "@type": "Organization",
    name: "By The Wave",
    url: "https://btw.sk",
    logo: { "@type": "ImageObject", url: "https://btw.sk/images/logo.svg" },
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Domov", item: "https://btw.sk" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://btw.sk/blog" },
  ],
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Script
        id="schema-collection-page"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ScrollToTop />
      <Header />

      {/* Hero */}
      <section className="bg-[#111111] py-20 pt-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-[#B88746] text-sm font-medium uppercase tracking-widest mb-4">By The Wave</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Náš Blog
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[#AAAAAA] text-lg max-w-2xl leading-relaxed">
              Praktické tipy na transfer na letisko, prenájom vozidiel a cestovanie po Slovensku. Píšeme o tom, čo naši klienti skutočne riešia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Blog grid with category filter */}
      <BlogGrid />

      <Footer />
    </div>
  )
}
