"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { registerSchema, type RegisterValues, Role } from "../schemas/register-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    shouldUnregister: true,
    defaultValues: {
      role: Role.CONSULTANT,
    },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Form data:", data)
    toast.success("Inscription réussie !", {
      description: `Bienvenue, ${data.firstName} !`,
    })
    setIsLoading(false)
    reset()
  }

  const handleRoleChange = (value: string | null) => {
    if (!value) return
    setValue("role", value as RegisterValues["role"])
  }

  return (
    <div className="rounded-[24px] border-[1.5px] border-zinc-200 bg-white p-10 shadow-none">
      <div className="mb-10 space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#2d4f44]">Créer un compte</h1>
        <p className="text-sm font-medium uppercase tracking-widest text-[11px]">
          Rejoignez la plateforme OpenCarbon
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <Field>
            <FieldLabel className="text-[11px] font-bold uppercase tracking-widest">Type de compte</FieldLabel>
            <Tabs
              value={selectedRole ?? Role.CONSULTANT}
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
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <Field>
              <FieldLabel htmlFor="firstName" className="text-[11px] font-bold uppercase tracking-widest">Prénom</FieldLabel>
              <Input
                id="firstName"
                placeholder="Jean"
                disabled={isLoading}
                {...register("firstName")}
                className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
              />
              <FieldError errors={[errors.firstName]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName" className="text-[11px] font-bold uppercase tracking-widest">Nom</FieldLabel>
              <Input
                id="lastName"
                placeholder="Dupont"
                disabled={isLoading}
                {...register("lastName")}
                className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
              />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@exemple.com"
              disabled={isLoading}
              {...register("email")}
              className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
            />
            <FieldError errors={[errors.email]} />
          </Field>

          {selectedRole === Role.ENTREPRISE && (
            <Field>
              <FieldLabel htmlFor="companyName" className="text-[11px] font-bold uppercase tracking-widest">Nom de l&apos;entreprise</FieldLabel>
              <Input
                id="companyName"
                placeholder="OpenCarbon Inc."
                disabled={isLoading}
                {...register("companyName")}
                className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14"
              />
              {/* @ts-expect-error - discriminated union field access */}
              <FieldError errors={[selectedRole === Role.ENTREPRISE ? errors.companyName : undefined]} />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest">Mot de passe</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("password")}
              className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14 font-mono"
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-widest">Confirmer le mot de passe</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("confirmPassword")}
              className="rounded-sm border-zinc-100 bg-zinc-50/50 p-6 shadow-none focus-visible:ring-[#2d4f44]/20 h-14 font-mono"
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>
        </div>

        <Button
          type="submit"
          className="w-full h-16 rounded-full bg-[#2d4f44] text-white shadow-none hover:bg-[#1e352d] text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "S'inscrire"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm border-t border-zinc-100 pt-8">
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
