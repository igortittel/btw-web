"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function ExpandableSection({ title, children, defaultExpanded = false }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border-b border-[#333333] py-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-[#CCCCCC]" />
        ) : (
          <ChevronRight className="w-5 h-5 text-[#CCCCCC]" />
        )}
      </button>
      {isExpanded && <div className="mt-3 text-[#CCCCCC]">{children}</div>}
    </div>
  )
}
