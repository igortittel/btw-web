import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  buttonText: string
  buttonLink?: string
}

export function ServiceCard({ icon, title, description, features, buttonText, buttonLink }: ServiceCardProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#B88746] border-2 rounded-xl">
      <CardContent className="p-4 md:p-8">
        <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="text-[#B88746] text-2xl flex-shrink-0 self-center md:self-start">{icon}</div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <ul className="text-[#CCCCCC] text-sm space-y-2 mb-6">
              {features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
            <p className="text-[#CCCCCC] text-sm mb-6">{description}</p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-3 w-full md:w-auto md:flex-shrink-0">
            <Link
              href={
                buttonText.includes("Vybrať vozidlo")
                  ? "https://booqme.sk/sk/rezervacia/btw"
                  : buttonText.includes("Vybrať termín")
                    ? "/rezervacie"
                    : buttonText.includes("Viac info o preprave")
                      ? "/preprava-osob"
                      : buttonText.includes("Mám záujem")
                        ? "/kontakt"
                        : "https://booqme.sk/sk/rezervacia/btw"
              }
              target={
                buttonText.includes("Vybrať vozidlo") || buttonText.includes("Vybrať termín") ? "_blank" : undefined
              }
              rel={
                buttonText.includes("Vybrať vozidlo") || buttonText.includes("Vybrať termín")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <Button className="bg-[#B88746] hover:bg-[#A67C52] text-white font-medium px-6 py-2 rounded-lg w-full md:w-auto">
                {buttonText}
              </Button>
            </Link>
            {buttonLink && (
              <Link href={buttonLink}>
                <button className="text-[#CCCCCC] hover:text-white underline text-sm text-center md:text-right">
                  Podrobné informácie
                </button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
