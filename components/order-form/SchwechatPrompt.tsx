"use client"

import { Plane, X } from "lucide-react"

type Props = {
  onConfirm: () => void
  onDismiss: () => void
}

export function SchwechatPrompt({ onConfirm, onDismiss }: Props) {
  return (
    <div
      role="dialog"
      aria-label="Potvrdenie destinácie"
      className="mt-2 p-3 rounded-lg border border-[#B88746]/50 bg-[#B88746]/10 flex items-start gap-3"
    >
      <Plane className="w-5 h-5 text-[#B88746] mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#D4A96A] leading-relaxed">
          <strong className="text-[#B88746]">Mali ste na mysli Letisko Schwechat?</strong>
          <br />
          Ak idete na letisko Viedeň (VIE), vyberte áno — presnejšie spočítame cenu.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="bg-[#B88746] hover:bg-[#A67C52] text-white text-sm font-medium rounded-md px-3 py-1.5 transition-colors"
          >
            Áno, Letisko Schwechat
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="bg-transparent border border-[#333333] hover:border-[#B88746] text-white text-sm font-medium rounded-md px-3 py-1.5 transition-colors inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Nie, ponechať
          </button>
        </div>
      </div>
    </div>
  )
}
