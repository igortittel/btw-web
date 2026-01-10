import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Fuel, Users, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface VehicleCardProps {
  id?: number
  title: string
  subtitle?: string
  price: string
  image: string
  interiorImages: string[]
  primaryButton: string
  secondaryButton?: string
}

export function VehicleCard({
  id = 1,
  title,
  subtitle,
  price,
  image,
  interiorImages,
  primaryButton,
  secondaryButton,
}: VehicleCardProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#333333] overflow-hidden rounded-xl hover:border-[#444444] transition-colors">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={200}
            height={120}
            className="mx-auto object-contain mb-6"
          />

          <div className="flex justify-center gap-2 mb-8">
            {interiorImages.slice(0, 3).map((img, index) => (
              <Image
                key={index}
                src={img || "/placeholder.svg"}
                alt={`Interior ${index + 1}`}
                width={45}
                height={35}
                className="rounded-lg object-cover"
                style={{ borderRadius: "8px" }}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          {subtitle && <h4 className="text-lg font-bold text-white mb-4">{subtitle}</h4>}
          <p className="text-[#CCCCCC] text-sm mb-8">{price}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <Settings className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">Automat</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Fuel className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">Diesel</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">7 osôb</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Car className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">Van</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/nase-vozidla">
              <Button className="w-full bg-[#B88746] hover:bg-[#A67C52] text-white font-medium py-3 rounded-lg">
                {primaryButton}
              </Button>
            </Link>
            {secondaryButton && (
              <Link href={`/nase-vozidla/${id}`}>
                <button className="w-full text-[#CCCCCC] hover:text-white underline text-sm">{secondaryButton}</button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
