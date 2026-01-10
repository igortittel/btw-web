import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Briefcase, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TransferVehicleCardProps {
  category: string
  title: string
  image: string
  maxPassengers: number
  maxLuggage: number
}

export function TransferVehicleCard({ category, title, image, maxPassengers, maxLuggage }: TransferVehicleCardProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#333333] overflow-hidden rounded-xl hover:border-[#444444] transition-colors mb-6">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <p className="text-[#CCCCCC] text-sm mb-3">Kategória</p>
          <h3 className="text-xl font-bold text-white mb-10">{category}</h3>

          <div className="mb-10">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={300}
              height={180}
              className="mx-auto object-contain"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Car className="w-4 h-4 text-[#CCCCCC]" />
            <span className="text-sm text-[#CCCCCC]">{title}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">max. {maxPassengers}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-[#CCCCCC]" />
              <span className="text-sm text-[#CCCCCC]">max. {maxLuggage}</span>
            </div>
          </div>
        </div>

        <Link href="/preprava-osob">
          <Button className="w-full bg-[#B88746] hover:bg-[#A67C52] text-white font-medium py-3 rounded-lg">
            Rezervovať
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
