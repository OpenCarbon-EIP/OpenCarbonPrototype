"use client"

import { useRegisterStore } from "../../stores/use-register-store"
import { Role } from "../../schemas/register-schema"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function StepIdentity() {
  const { values, errors, setField, isLoading } = useRegisterStore()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="firstName" className="text-[11px] font-bold uppercase tracking-widest">Prénom</FieldLabel>
          <Input
            id="firstName"
            placeholder="Jean"
            disabled={isLoading}
            value={values.firstName ?? ""}
            onChange={(e) => setField("firstName", e.target.value)}
            autoFocus
            className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
          />
          <div aria-live="polite">
            <FieldError errors={errors.firstName ? [{ message: errors.firstName }] : []} />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName" className="text-[11px] font-bold uppercase tracking-widest">Nom</FieldLabel>
          <Input
            id="lastName"
            placeholder="Dupont"
            disabled={isLoading}
            value={values.lastName ?? ""}
            onChange={(e) => setField("lastName", e.target.value)}
            className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
          />
          <div aria-live="polite">
            <FieldError errors={errors.lastName ? [{ message: errors.lastName }] : []} />
          </div>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="jean.dupont@exemple.com"
          disabled={isLoading}
          value={values.email ?? ""}
          onChange={(e) => setField("email", e.target.value)}
          className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
        />
        <div aria-live="polite">
          <FieldError errors={errors.email ? [{ message: errors.email }] : []} />
        </div>
      </Field>

      {values.role === Role.ENTREPRISE && (
        <Field>
          <FieldLabel htmlFor="companyName" className="text-[11px] font-bold uppercase tracking-widest">Nom de l&apos;entreprise</FieldLabel>
          <Input
            id="companyName"
            placeholder="OpenCarbon Inc."
            disabled={isLoading}
            value={(values as any).companyName ?? ""}
            onChange={(e) => setField("companyName" as any, e.target.value)}
            className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
          />
          <div aria-live="polite">
            <FieldError errors={errors.companyName ? [{ message: errors.companyName }] : []} />
          </div>
        </Field>
      )}
    </div>
  )
}
