"use client"

import { useRegisterStore } from "../../stores/use-register-store"
import { Role } from "../../schemas/register-schema"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function StepRole() {
  const { values, errors, setField } = useRegisterStore()

  const handleRoleChange = (value: string | null) => {
    if (!value) return
    setField("role", value as never)
  }

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel className="text-[11px] font-bold uppercase tracking-widest">Type de compte</FieldLabel>
        <Tabs
          value={values.role}
          onValueChange={handleRoleChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 p-1 bg-zinc-50 border border-zinc-100 rounded-full h-12 space-x-2">
            <TabsTrigger
              value={Role.ENTREPRISE}
              className="rounded-full data-active:bg-[#2d4f44] data-active:text-white data-active:hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-[#2d4f44]/10 data-active:hover:bg-[#2d4f44]"
            >
              Entreprise
            </TabsTrigger>
            <TabsTrigger
              value={Role.CONSULTANT}
              className="rounded-full data-active:bg-[#2d4f44] data-active:text-white data-active:hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-[#2d4f44]/10 data-active:hover:bg-[#2d4f44]"
            >
              Consultant
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div aria-live="polite">
          <FieldError errors={errors.role ? [{ message: errors.role }] : []} />
        </div>
      </Field>
    </div>
  )
}
