"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useOnboardingStore, OnboardingStep } from "../stores/use-onboarding-store"
import { useRegisterStore } from "@/features/auth/stores/use-register-store"
import { Role } from "@/features/auth/schemas/register-schema"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { OnboardingHeader } from "./onboarding-header"
import { ProfileStep } from "./profile-step"
import { CertificationsStep } from "./certifications-step"
import { MissionsStep } from "./missions-step"
import { ReviewStep } from "./review-step"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

export function OnboardingWizard() {
  const router = useRouter()
  const {
    values,
    currentStep,
    isLoading,
    isHydrated,
    isSkipped,
    setSkipped,
    nextStep,
    prevStep,
    setLoading,
    resetStore,
    validateStep,
  } = useOnboardingStore()

  useEffect(() => {
    if (isHydrated) {
      const { role } = useRegisterStore.getState().values
      
      if (isSkipped || role !== Role.CONSULTANT) {
        router.replace("/dashboard")
      }
    }
  }, [isHydrated, isSkipped, router])

  if (!isHydrated) {
    return (
      <div className="rounded-[24px] border-[1.5px] border-zinc-100 bg-white p-12 shadow-none flex flex-col items-center justify-center min-h-125">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2d4f44] border-t-transparent mb-4" />
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[11px]">Chargement de votre session...</p>
      </div>
    )
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isValid = validateStep(OnboardingStep.REVIEW)
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs avant de terminer")
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      console.log("Final onboarding data:", values)
      
      toast.success("Profil complété avec succès !", {
        description: "Bienvenue sur OpenCarbon. Votre profil est en cours de validation.",
      })
      
      resetStore()
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error) {
      console.error(error)
      toast.error("Une erreur est survenue lors de la finalisation de votre profil")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.PROFILE:
        return <ProfileStep />
      case OnboardingStep.CERTIFICATIONS:
        return <CertificationsStep />
      case OnboardingStep.MISSIONS:
        return <MissionsStep />
      case OnboardingStep.REVIEW:
        return <ReviewStep />
      default:
        return <ProfileStep />
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <OnboardingHeader currentStep={currentStep} />

      <div className="rounded-[24px] border-[1.5px] border-zinc-100 bg-white p-10 shadow-sm min-h-125 flex flex-col">
        <form onSubmit={handleFinalSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 mb-10">
            {renderStep()}
          </div>

          <div className="flex gap-4 pt-8 border-t border-zinc-100">
            {currentStep > OnboardingStep.PROFILE && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="w-1/3 h-14 rounded-full border-zinc-200 text-[#2d4f44] text-[11px] font-bold uppercase tracking-[0.2em] transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            )}
            
            {currentStep < OnboardingStep.REVIEW ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (!nextStep()) {
                    toast.error("Veuillez remplir les champs obligatoires")
                  }
                }}
                className={`h-14 rounded-full bg-[#2d4f44] text-white shadow-none hover:bg-[#1e352d] text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${
                  currentStep === OnboardingStep.PROFILE ? "w-full" : "w-2/3"
                }`}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="w-2/3 h-14 rounded-full bg-[#2d4f44] text-white shadow-none hover:bg-[#1e352d] text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <div className="flex items-center">
                    Finaliser mon profil
                    <Check className="h-4 w-4 ml-2" />
                  </div>
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSkipped(true)
              router.push("/dashboard")
            }}
            className="text-zinc-400 hover:text-[#2d4f44] text-[12px] font-bold uppercase tracking-[0.2em] transition-all h-auto py-2"
          >
            Passer l&apos;onboarding pour le moment
          </Button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
        Besoin d&apos;aide ? Contactez notre équipe support@opencarbon.com
      </p>
    </div>
  )
}
