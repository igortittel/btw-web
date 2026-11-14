"use client"

import { Check } from "lucide-react"
import type { Step } from "./useOrderForm"

type Props = {
  current: Step
  onNavigateBack: (step: Step) => void
}

type NodeDef = { step: Step; label: string }

const NODES: NodeDef[] = [
  { step: 1, label: "Cesta" },
  { step: 2, label: "Údaje" },
  { step: 3, label: "Súhrn" },
]

function stepIndex(step: Step): number {
  if (step === 1) return 0
  if (step === 1.5) return 0.5
  if (step === 2) return 1
  return 2
}

export function StepProgress({ current, onNavigateBack }: Props) {
  const currentIdx = stepIndex(current)
  return (
    <nav aria-label="Priebeh objednávky" className="w-full">
      <ol className="flex items-start justify-between gap-2 relative">
        {NODES.map((node, i) => {
          const idx = i
          const isCompleted = currentIdx > idx
          const isActive = idx === Math.floor(currentIdx) || (idx === 0 && current === 1.5)
          const clickable = isCompleted && node.step !== current
          return (
            <li key={node.step} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute top-3.5 right-1/2 w-full h-[2px] -translate-x-0 ${
                    currentIdx >= idx ? "bg-[#B88746]" : "bg-[#2a2a2a]"
                  }`}
                />
              )}
              {i === 0 && (
                <EuroBadge visible={currentIdx >= 0.5} />
              )}
              <button
                type="button"
                onClick={() => clickable && onNavigateBack(node.step)}
                disabled={!clickable}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Krok ${node.step}: ${node.label}`}
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isCompleted
                    ? "bg-transparent border-2 border-[#B88746] text-[#B88746] hover:bg-[#B88746]/10 cursor-pointer"
                    : isActive
                    ? "bg-[#B88746] text-white"
                    : "bg-transparent border-2 border-[#333333] text-[#555555]"
                } ${clickable ? "" : "cursor-default"}`}
              >
                {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : node.step}
              </button>
              <span
                className={`mt-2 text-[11px] md:text-xs font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : isCompleted
                    ? "text-[#888888]"
                    : "text-[#555555]"
                } hidden md:inline`}
              >
                {node.label}
              </span>
              {isActive && (
                <span className="mt-2 text-[11px] font-medium text-white md:hidden">
                  {node.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function EuroBadge({ visible }: { visible: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute top-1 left-[calc(50%+1.25rem)] w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-20 transition-colors ${
        visible
          ? "border-[#B88746] bg-[#0b0b0b] text-[#B88746]"
          : "border-[#2a2a2a] bg-[#0b0b0b] text-[#333333]"
      }`}
    >
      €
    </span>
  )
}
