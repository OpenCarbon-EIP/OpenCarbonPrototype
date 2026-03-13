import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { registerSchema, Role, type RegisterValues } from "../schemas/register-schema"
import { z } from "zod"

export enum RegisterStep {
  ROLE = 0,
  IDENTITY = 1,
  CREDENTIALS = 2,
}

interface RegisterState {
  values: RegisterValues
  errors: Record<string, string>
  currentStep: RegisterStep
  isLoading: boolean
  isHydrated: boolean

  setField: <K extends keyof RegisterValues>(field: K, value: RegisterValues[K]) => void
  setStep: (step: RegisterStep) => void
  nextStep: () => boolean
  prevStep: () => void
  setLoading: (loading: boolean) => void
  setHydrated: () => void
  reset: () => void
  validateStep: (step: RegisterStep) => boolean
  clearErrors: () => void
}

const initialValues: RegisterValues = {
  role: Role.CONSULTANT,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set, get) => ({
      values: initialValues,
      errors: {},
      currentStep: RegisterStep.ROLE,
      isLoading: false,
      isHydrated: false,

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

      setStep: (step) => set({ currentStep: step }),

      clearErrors: () => set({ errors: {} }),

      validateStep: (step) => {
        const { values } = get()
        let fieldsToValidate: string[] = []

        if (step === RegisterStep.ROLE) {
          fieldsToValidate = ["role"]
        } else if (step === RegisterStep.IDENTITY) {
          fieldsToValidate = ["firstName", "lastName", "email"]
          if (values.role === Role.ENTREPRISE) {
            fieldsToValidate.push("companyName")
          }
        } else if (step === RegisterStep.CREDENTIALS) {
          fieldsToValidate = ["password", "confirmPassword"]
        }

        const result = registerSchema.safeParse(values)
        
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
          if (currentStep < RegisterStep.CREDENTIALS) {
            set({ currentStep: (currentStep + 1) as RegisterStep })
            return true
          }
        }
        return false
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > RegisterStep.ROLE) {
          set({ currentStep: (currentStep - 1) as RegisterStep, errors: {} })
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setHydrated: () => set({ isHydrated: true }),

      reset: () => {
        set({ values: initialValues, errors: {}, currentStep: RegisterStep.ROLE, isLoading: false })
        sessionStorage.removeItem("register-storage")
      },
    }),
    {
      name: "register-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      partialize: (state) => {
        const { password, confirmPassword, ...restValues } = state.values
        return {
          values: restValues,
          currentStep: state.currentStep,
        } as any
      },
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          ...persistedState,
          values: {
            ...currentState.values,
            ...(persistedState?.values || {}),
            password: "",
            confirmPassword: "",
          },
          errors: {},
        }
      },
    }
  )
)
