import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { onboardingSchema, type OnboardingValues, type CertificationValues, type MissionProofValues, ExpertiseEnum } from "../schemas/onboarding-schema"

export enum OnboardingStep {
  PROFILE = 0,
  CERTIFICATIONS = 1,
  MISSIONS = 2,
  REVIEW = 3,
}

interface OnboardingState {
  values: OnboardingValues
  errors: Record<string, string>
  currentStep: OnboardingStep
  isLoading: boolean
  isHydrated: boolean

  setField: <K extends keyof OnboardingValues>(field: K, value: OnboardingValues[K]) => void
  addCertification: (cert: CertificationValues) => void
  removeCertification: (id: string) => void
  addMissionProof: (mission: MissionProofValues) => void
  removeMissionProof: (id: string) => void
  
  setStep: (step: OnboardingStep) => void
  nextStep: () => boolean
  prevStep: () => void
  setLoading: (loading: boolean) => void
  setHydrated: () => void
  setSkipped: (skipped: boolean) => void
  resetStore: () => void
  validateStep: (step: OnboardingStep) => boolean
  clearErrors: () => void
  isSkipped: boolean
}

const initialValues: OnboardingValues = {
  bio: "",
  expertise: ExpertiseEnum.BILAN_CARBONE,
  certifications: [],
  missionProofs: [],
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      values: initialValues,
      errors: {},
      currentStep: OnboardingStep.PROFILE,
      isLoading: false,
      isHydrated: false,
      isSkipped: false,

      setField: (field, value) => {
        set((state) => ({
          values: { ...state.values, [field]: value },
        }))

        set((state) => {
          if (!state.errors[field as string]) return state
          const newErrors = { ...state.errors }
          delete newErrors[field as string]
          return { errors: newErrors }
        })
      },

      addCertification: (cert) => {
        set((state) => ({
          values: {
            ...state.values,
            certifications: [...state.values.certifications, cert],
          },
        }))

        set((state) => {
          const newErrors = { ...state.errors }
          delete newErrors.certifications
          return { errors: newErrors }
        })
      },

      removeCertification: (id) => {
        set((state) => ({
          values: {
            ...state.values,
            certifications: state.values.certifications.filter((c) => c.id !== id),
          },
        }))
      },

      addMissionProof: (mission) => {
        set((state) => ({
          values: {
            ...state.values,
            missionProofs: [...state.values.missionProofs, mission],
          },
        }))

        set((state) => {
          const newErrors = { ...state.errors }
          delete newErrors.missionProofs
          return { errors: newErrors }
        })
      },

      removeMissionProof: (id) => {
        set((state) => ({
          values: {
            ...state.values,
            missionProofs: state.values.missionProofs.filter((m) => m.id !== id),
          },
        }))
      },

      setStep: (step) => set({ currentStep: step }),

      clearErrors: () => set({ errors: {} }),

      validateStep: (step) => {
        const { values } = get()
        let fieldsToValidate: string[] = []

        if (step === OnboardingStep.PROFILE) {
          fieldsToValidate = ["bio", "expertise"]
        } else if (step === OnboardingStep.CERTIFICATIONS) {
          fieldsToValidate = ["certifications"]
        } else if (step === OnboardingStep.MISSIONS) {
          fieldsToValidate = ["missionProofs"]
        } else if (step === OnboardingStep.REVIEW) {
          fieldsToValidate = ["bio", "expertise", "certifications", "missionProofs"]
        }

        const result = onboardingSchema.safeParse(values)
        
        if (!result.success) {
          const stepErrors: Record<string, string> = {}
          let hasStepError = false
          
          result.error.errors.forEach((err) => {
            const path = err.path[0] as string
            if (fieldsToValidate.includes(path)) {
              stepErrors[path] = err.message
              hasStepError = true
            }
          })
          
          if (hasStepError) {
            set((state) => ({ errors: { ...state.errors, ...stepErrors } }))
            return false
          }
        }
        
        set((state) => {
          const newErrors = { ...state.errors }
          fieldsToValidate.forEach(field => delete newErrors[field])
          return { errors: newErrors }
        })
        return true
      },

      nextStep: () => {
        const { currentStep, validateStep } = get()
        if (validateStep(currentStep)) {
          if (currentStep < OnboardingStep.REVIEW) {
            set({ currentStep: (currentStep + 1) as OnboardingStep })
            return true
          }
        }
        return false
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > OnboardingStep.PROFILE) {
          set({ currentStep: (currentStep - 1) as OnboardingStep, errors: {} })
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setHydrated: () => set({ isHydrated: true }),

      setSkipped: (skipped) => set({ isSkipped: skipped }),

      resetStore: () => {
        set({ values: initialValues, errors: {}, currentStep: OnboardingStep.PROFILE, isLoading: false, isSkipped: false })
        sessionStorage.removeItem("onboarding-storage")
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
