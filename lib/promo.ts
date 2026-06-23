export type PromoData = {
  active: boolean
  eClass: { odchod: number; prichod: number; regular: number }
  vClass: { odchod: number; prichod: number; regular: number }
  validFrom: string
  validUntil: string
}

export function getPromoData(): PromoData {
  const now = new Date()
  const year = now.getFullYear()
  const start = new Date(year, 5, 15)       // 15. júna
  const end = new Date(year, 8, 15, 23, 59, 59) // 15. septembra

  return {
    active: now >= start && now <= end,
    eClass: { odchod: 60, prichod: 65.9, regular: 73 },
    vClass: { odchod: 99, prichod: 104.9, regular: 115 },
    validFrom: "15. júna",
    validUntil: "15. septembra",
  }
}
