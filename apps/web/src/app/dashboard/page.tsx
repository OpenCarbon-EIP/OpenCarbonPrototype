"use client"

import { useEffect, useState } from "react"
import { useRegisterStore } from "@/features/auth/stores/use-register-store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState<string>("")
  const isHydrated = useRegisterStore((state) => state.isHydrated)

  useEffect(() => {
    if (isHydrated) {
      const storedFirstName = useRegisterStore.getState().values.firstName
      if (storedFirstName) {
        setFirstName(storedFirstName)
      }
      
      useRegisterStore.getState().reset()
    }
  }, [isHydrated])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-medium uppercase tracking-[0.2em] text-[11px]">
          Chargement...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-[24px] border-[1.5px] border-border px-10 py-12 text-center space-y-8 shadow-sm">
        <div className="space-y-4">
          <h1 className="text-primary text-4xl font-bold uppercase tracking-[0.2em]">
            Dashboard
          </h1>
          <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-medium text-foreground">
            Bienvenue, {firstName || "Utilisateur"} !
          </p>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Votre compte a été configuré avec succès. Vous pouvez maintenant accéder à l'ensemble des fonctionnalités d'OpenCarbon.
          </p>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <Button 
            className="h-14 px-10 rounded-full bg-primary text-primary-foreground shadow-none hover:bg-primary/90 text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
            onClick={() => router.push("/")}
          >
            Retour à l'accueil
          </Button>
          
          <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-widest mt-4">
            POC — Prototype Étape Finale
          </p>
        </div>
      </div>
    </div>
  )
}
