"use client"

import { useState } from "react"
import Script from "next/script"
import { CheckCircle } from "lucide-react"
import { StepProgress } from "./StepProgress"
import { StepTripInfo } from "./StepTripInfo"
import { StepPriceEstimate } from "./StepPriceEstimate"
import { StepCustomerDetails } from "./StepCustomerDetails"
import { StepSummary } from "./StepSummary"
import { useOrderForm, type Step } from "./useOrderForm"

export function OrderForm() {
  const { state, dispatch } = useOrderForm()
  const [mapsLoaded, setMapsLoaded] = useState(false)

  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const scriptSrc = googleKey
    ? `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`
    : ""

  const navigateBack = (step: Step) => {
    dispatch({ type: "GO_STEP", step })
  }

  return (
    <section className="py-12 px-6 bg-[#0b0b0b]">
      <div className="max-w-3xl mx-auto">
        {scriptSrc && (
          <Script
            src={scriptSrc}
            strategy="afterInteractive"
            onLoad={() => setMapsLoaded(true)}
          />
        )}

        {state.submitted ? (
          <SuccessBox onReset={() => dispatch({ type: "RESET" })} />
        ) : (
          <>
            <StepProgress current={state.step} onNavigateBack={navigateBack} />
            <div className="mt-10">
              {state.step === 1 && (
                <StepTripInfo state={state} dispatch={dispatch} mapsReady={mapsLoaded} />
              )}
              {state.step === 1.5 && (
                <StepPriceEstimate state={state} dispatch={dispatch} />
              )}
              {state.step === 2 && (
                <StepCustomerDetails state={state} dispatch={dispatch} />
              )}
              {state.step === 3 && (
                <StepSummary state={state} dispatch={dispatch} />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function SuccessBox({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#B88746]/10 border border-[#B88746]/40">
      <CheckCircle className="w-6 h-6 text-[#B88746] flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-xl font-bold text-white">Objednávka odoslaná.</h3>
        <p className="text-[#CCCCCC] mt-2 leading-relaxed">
          Ďakujeme! Vašu objednávku sme prijali. Potvrdenie sme zaslali na váš e-mail
          a najneskôr do 24 hodín vás kontaktujeme s detailami.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 text-sm text-[#B88746] hover:underline"
        >
          Zadať novú objednávku →
        </button>
      </div>
    </div>
  )
}
