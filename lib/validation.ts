const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): string | null {
  const v = value.trim()
  if (v.length < 3) return "E-mail je povinný."
  if (!EMAIL_RE.test(v)) return "Neplatný formát e-mailu."
  return null
}

export function validateName(value: string, label = "Meno"): string | null {
  const v = value.trim()
  if (v.length < 2) return `${label} musí mať aspoň 2 znaky.`
  return null
}

export function validatePhone(value: string): string | null {
  const v = value.trim()
  if (v.length < 6) return "Telefónne číslo je príliš krátke."
  if (!/^[+\d\s\-()]+$/.test(v)) return "Telefónne číslo obsahuje nepovolené znaky."
  return null
}

export function validatePax(value: number): string | null {
  if (!Number.isFinite(value) || value < 1) return "Zadajte počet pasažierov (min 1)."
  if (value > 20) return "Pre viac než 20 pasažierov nás prosím kontaktujte individuálne."
  return null
}

export function validateDateFuture(dateStr: string): string | null {
  if (!dateStr) return "Dátum je povinný."
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return "Neplatný dátum."
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (d < today) return "Dátum nemôže byť v minulosti."
  return null
}

export function validateDateAfter(dateStr: string, afterStr: string): string | null {
  if (!dateStr) return "Dátum je povinný."
  if (!afterStr) return null
  const d = new Date(dateStr)
  const a = new Date(afterStr)
  if (d < a) return "Dátum spiatočnej cesty musí byť v deň alebo po dátume vyzdvihnutia."
  return null
}

export function validateTime(timeStr: string): string | null {
  if (!timeStr) return "Čas je povinný."
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return "Neplatný formát času (HH:MM)."
  return null
}

export function validatePlace(
  addressValue: string,
  placeId: string,
  label = "Adresa",
): string | null {
  if (!addressValue.trim()) return `${label} je povinná.`
  if (!placeId) return `${label} musí byť vybraná z návrhov autocomplete.`
  return null
}
