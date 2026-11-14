export const INPUT_BASE =
  "bg-[#1d1d1d] border border-[#333333] text-white placeholder:text-[#666666] rounded-lg py-3 px-4 transition-colors w-full outline-none focus:border-[#B88746]"

export const INPUT_ERROR = "border-red-500 focus:border-red-500"

export const inputClass = (hasError?: boolean) =>
  hasError ? `${INPUT_BASE} ${INPUT_ERROR}` : INPUT_BASE

export const LABEL_CLASS = "block text-sm font-medium mb-2 text-white"

export const ERROR_TEXT_CLASS = "text-red-500 text-sm mt-1 flex items-center gap-1"

export const PRIMARY_BUTTON_CLASS =
  "bg-[#B88746] hover:bg-[#A67C52] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-3 px-6 font-medium transition-colors inline-flex items-center justify-center gap-2"

export const SECONDARY_BUTTON_CLASS =
  "bg-[#1d1d1d] border border-[#333333] hover:border-[#B88746] text-white rounded-lg py-3 px-6 font-medium transition-colors inline-flex items-center justify-center gap-2"

export const CARD_BASE =
  "bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6"

export const AMBER_NOTE_CLASS =
  "p-4 rounded-lg border border-[#B88746]/40 bg-[#B88746]/10 text-sm text-[#D4A96A] leading-relaxed"
