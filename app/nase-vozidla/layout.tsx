import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Naše vozidlá - Prenájom vozidiel na krátkodobá a dlhodobý prenájom",
  description:
    "Prezrite si našu flotilu prémiových vozidiel. Krátkodobý aj dlhodobý prenájom, profesionálni šoféri a komfort bez kompromisov.",
  keywords: [
    "prenájom vozidiel Slovensko",
    "Mercedes prenájom Bratislava",
    "BMW prenájom",
    "Hyundai Staria prenájom",
    "luxusné autá prenájom",
    "transfer vozidlá",
    "business class vozidlá",
    "first class prenájom",
  ],
  openGraph: {
    title: "Naše vozidlá - Prémiové autá a transfer | BY THE WAVE",
    description:
      "Prezrite si našu flotilu prémiových vozidiel. Krátkodobý aj dlhodobý prenájom, profesionálni šoféri a komfort bez kompromisov.",
    url: "https://bythewave.sk/nase-vozidla",
    images: [
      {
        url: "/images/vehicles-og.png",
        width: 800,
        height: 600,
        alt: "Flotila prémiových vozidiel BY THE WAVE",
      },
    ],
  },
  alternates: {
    canonical: "https://bythewave.sk/nase-vozidla",
  },
}

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
