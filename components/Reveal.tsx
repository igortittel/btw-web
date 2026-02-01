"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

export interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  /** If true, reveal triggers only once. */
  once?: boolean
}

export function Reveal({ children, delay = 0, y = 24, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Fallback: if IO isn’t available, just show.
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}s`,
        transform: isVisible ? "translateY(0px)" : `translateY(${y}px)`,
      }}
      className={[
        "will-change-transform",
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {children}
    </div>
  )
}

export default Reveal