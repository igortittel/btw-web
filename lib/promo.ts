export type PromoData = {
  active: boolean
  eClass: { odchod: number; prichod: number; regular: number }
  vClass: { odchod: number; prichod: number; regular: number }
  validFrom: string
  validUntil: string
}

export function getPromoData(): PromoData {
  return {
    active: false,
    eClass: { odchod: 60, prichod: 65.9, regular: 73 },
    vClass: { odchod: 99, prichod: 104.9, regular: 115 },
    validFrom: "15. júna",
    validUntil: "15. septembra",
  }
}
