import { SCHWECHAT_PLACE_ID } from "./places"

export { SCHWECHAT_PLACE_ID }
export const SCHWECHAT_LABEL = "Letisko Viedeň-Schwechat (VIE)"

export function isAirportPlace(
  placeId: string | null | undefined,
  placeTypes?: readonly string[] | null,
): boolean {
  if (placeId === SCHWECHAT_PLACE_ID) return true
  if (placeTypes?.includes("airport")) return true
  return false
}

export function shouldOfferSchwechatPrompt(
  formattedAddress: string,
  placeTypes?: readonly string[] | null,
): boolean {
  const normalized = formattedAddress.toLowerCase()
  const mentionsSchwechat = normalized.includes("schwechat")
  const isAlreadyAirport = placeTypes?.includes("airport") ?? false
  return mentionsSchwechat && !isAlreadyAirport
}
