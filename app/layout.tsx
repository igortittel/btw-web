import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import CookieConsent from "@/components/cookie-consent"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://bythewave.sk"),
  title: {
    default: "By The Wave - Prenájom luxusných vanov a prémiová preprava osôb",
    template: "%s | By The Wave",
  },
  description:
    "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá, profesionálni vodiči, krátkodobý a dlhodobý prenájom. Executive mobility služby pre náročných klientov.",
  keywords: [
    "prenájom vozidiel Slovensko",
    "luxusné vozidlá prenájom",
    "executive mobility",
    "preprava osôb Bratislava",
    "prenájom áut Slovensko",
    "Mercedes prenájom",
    "BMW prenájom",
    "Hyundai Staria prenájom",
    "krátkodobý prenájom vozidiel",
    "dlhodobý prenájom vozidiel",
    "šofér s vozidlom",
    "VIP preprava",
    "business class vozidlá",
    "prenájom dodávok",
    "car rental Slovakia",
  ],
  authors: [{ name: "BY THE WAVE" }],
  creator: "BY THE WAVE",
  publisher: "BY THE WAVE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/images/logo.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://bythewave.sk",
    siteName: "By The Wave - Prenájom luxusných vanov a prémiová preprava osôb",
    title: "By The Wave - Prenájom luxusných vanov a prémiová preprava osôb",
    description:
      "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá, profesionálni vodiči a exkluzívne služby mobility.",
    images: [
      {
        url: "/images/hero-background.png",
        width: 1200,
        height: 630,
        alt: "BY THE WAVE - Executive Mobility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "By The Wave - Prenájom luxusných vanov a prémiová preprava osôb",
    description:
      "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku. Luxusné vozidlá a profesionálni vodiči.",
    images: ["/images/hero-background.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://btw.sk",
    languages: {
      "sk-SK": "https://btw.sk",
    },
  },
  category: "business",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <head>
        <link rel="canonical" href="https://btw.sk" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logo.png" sizes="180x180" />
        <meta name="theme-color" content="#B88746" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BY THE WAVE",
              alternateName: "Executive Mobility",
              url: "https://btw.sk",
              logo: "https://btw.sk/images/logo.png",
              description: "Prémiové služby prenájmu vozidiel a prepravy osôb na Slovensku",
              address: {
                "@type": "PostalAddress",
                addressCountry: "SK",
                addressLocality: "Bratislava",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["Slovak", "English"],
              },
              sameAs: ["https://www.instagram.com/bythewave_sk/", "https://www.facebook.com/bythewavesk"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Vehicle Rental Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Krátkodobý prenájom vozidiel",
                      description: "Prenájom luxusných vozidiel od 1 dňa",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Dlhodobý prenájom vozidiel",
                      description: "Prenájom vozidiel od 30 dní až po 4 roky",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Preprava osôb",
                      description: "VIP preprava s profesionálnym šoférom",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Executive Mobility",
                      description: "Exkluzívne služby mobility na mieru",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={montserrat.className}>
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <>
            <Script
              id="gtm"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
                `,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        ) : null}

        {/* Cookie banner + Google Consent Mode v2 */}
        <CookieConsent />

        {/* App */}
        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.addEventListener('beforeunload', function() {
                window.scrollTo(0, 0);
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
