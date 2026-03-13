"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useRegisterStore, RegisterStep } from "../stores/use-register-store"
import { Role } from "../schemas/register-schema"
import { Button } from "@/components/ui/button"
import { StepRole } from "./steps/step-role"
import { StepIdentity } from "./steps/step-identity"
import { StepCredentials } from "./steps/step-credentials"

export function RegisterForm() {
  const router = useRouter()
  const {
    values,
    currentStep,
    isLoading,
    isHydrated,
    nextStep,
    prevStep,
    setLoading,
    purgeSensitiveData,
    validateStep,
    clearErrors,
  } = useRegisterStore()

  if (!isHydrated) {
    return (
      <div className="rounded-lg border-[1.5px] border-zinc-200 bg-white px-10 pt-10 pb-8 shadow-none flex items-center justify-center min-h-[400px]">
        <p className="text-zinc-400 animate-pulse">Chargement...</p>
      </div>
    )
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(RegisterStep.CREDENTIALS)) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Final registration data:", values)
      
      toast.success("Inscription réussie !", {
        description: `Bienvenue, ${values.firstName} !`,
      })
      
      purgeSensitiveData()
      
      if (values.role === Role.CONSULTANT) {
        router.push("/register/onboarding")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case RegisterStep.ROLE:
        return <StepRole />
      case RegisterStep.IDENTITY:
        return <StepIdentity />
      case RegisterStep.CREDENTIALS:
        return <StepCredentials />
      default:
        return <StepRole />
    }
  }

  return (
    <div className="rounded-lg border-[1.5px] border-zinc-200 bg-white px-10 pt-10 pb-8 shadow-none min-h-[400px]">
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#2d4f44]">Créer un compte</h1>
        <p className="text-sm font-medium uppercase tracking-widest text-[11px]">
          Rejoignez la plateforme OpenCarbon — Étape {currentStep + 1} sur 3
        </p>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-8">
        {renderStep()}

        <div className="flex gap-4">
          {currentStep > RegisterStep.ROLE && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="w-1/3 h-16 rounded-full border-zinc-200 text-[#2d4f44] text-[11px] font-bold uppercase tracking-[0.2em] transition-all"
            >
              Précédent
            </Button>
          )}
          
          {currentStep < RegisterStep.CREDENTIALS ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                nextStep()
              }}
              className={`h-16 rounded-full bg-[#2d4f44] text-white shadow-none hover:bg-[#1e352d] text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${
                currentStep === RegisterStep.ROLE ? "w-full" : "w-2/3"
              }`}
            >
              Suivant
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="w-2/3 h-16 rounded-full bg-[#2d4f44] text-white shadow-none hover:bg-[#1e352d] text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              {isLoading ? "Chargement..." : "S'inscrire"}
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm border-t border-zinc-100 pt-6">
        <p className="font-medium flex items-center justify-center gap-4">
          Vous avez déjà un compte ?
          <Link
            href="/login"
            className="inline-flex items-center font-bold text-[#2d4f44] hover:underline underline-offset-8 transition-all"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
