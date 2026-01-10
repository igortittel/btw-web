import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-[#111111] border-[#666666] text-center hover:bg-[#1A1A1A] transition-colors rounded-xl">
      <CardContent className="p-4 md:p-6">
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3">{icon}</div>
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">{title}</h3>
        <p className="text-[#CCCCCC] text-xs md:text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
