"use client"

import type { Variant } from "@/lib/pricing"
import type { PaymentMethod } from "./useOrderForm"

type Props = {
  variant: Variant | null
  method: PaymentMethod
}

// Placeholder for future Stripe / TrustPay / GoPay integration.
// Renders nothing in v1 — submission goes through /api/order and the
// `method` is recorded as intent only. When integration happens,
// render the card iframe / redirect button here and gate the final
// "Záväzne objednať" submit on a successful tokenization.
export function PaymentGateway(_props: Props) {
  return null
}
