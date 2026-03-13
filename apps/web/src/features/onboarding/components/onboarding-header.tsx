"use client"

import { Progress } from "@/components/ui/progress"
import { OnboardingStep } from "../stores/use-onboarding-store"

interface OnboardingHeaderProps {
  currentStep: OnboardingStep
}

export function OnboardingHeader({ currentStep }: OnboardingHeaderProps) {
  const totalSteps = Object.keys(OnboardingStep).filter((k) => isNaN(Number(k))).length
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100)

  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[#2d4f44]">Onboarding</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2d4f44]/60">
            Expert Consultant — Étape {currentStep + 1} / {totalSteps}
          </p>
        </div>
        <span className="text-[12px] font-black text-[#2d4f44] mb-1">{progress}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-zinc-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
