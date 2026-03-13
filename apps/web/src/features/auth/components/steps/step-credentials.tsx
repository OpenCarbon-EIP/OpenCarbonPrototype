"use client"

import { useRegisterStore } from "../../stores/use-register-store"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function StepCredentials() {
  const { values, errors, setField, isLoading } = useRegisterStore()

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest">Mot de passe</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          value={values.password ?? ""}
          onChange={(e) => setField("password", e.target.value)}
          autoFocus
          className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14 font-mono"
        />
        <div aria-live="polite">
          <FieldError errors={errors.password ? [{ message: errors.password }] : []} />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-widest">Confirmer le mot de passe</FieldLabel>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          value={values.confirmPassword ?? ""}
          onChange={(e) => setField("confirmPassword", e.target.value)}
          className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14 font-mono"
        />
        <div aria-live="polite">
          <FieldError errors={errors.confirmPassword ? [{ message: errors.confirmPassword }] : []} />
        </div>
      </Field>
    </div>
  )
}
