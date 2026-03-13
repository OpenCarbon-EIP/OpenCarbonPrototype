"use client"

import { useOnboardingStore } from "../stores/use-onboarding-store"
import { ExpertiseEnum, MIN_BIO_LENGTH, MAX_BIO_LENGTH } from "../schemas/onboarding-schema"
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfileStep() {
  const { values, setField, errors } = useOnboardingStore()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#2d4f44]">Votre profil expert</h2>
        <p className="text-sm text-zinc-500">Parlez-nous de votre expertise en décarbonation.</p>
      </div>

      <Field>
        <FieldLabel htmlFor="expertise" className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">
          Domaine d&apos;expertise principal
        </FieldLabel>
        <FieldContent>
          <Select
            value={values.expertise}
            onValueChange={(value) => setField("expertise", value as any)}
          >
            <SelectTrigger id="expertise" className="h-12 rounded-sm border-zinc-200 focus:ring-[#2d4f44]">
              <SelectValue placeholder="Sélectionnez votre expertise" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ExpertiseEnum).map(([key, label]) => (
                <SelectItem key={key} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
        {errors.expertise && <FieldError>{errors.expertise}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="bio" className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">
          Bio professionnelle
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="bio"
            placeholder="Décrivez votre parcours et vos compétences clés..."
            className="min-h-37.5 rounded-sm border-zinc-200 focus:ring-[#2d4f44] resize-none"
            value={values.bio}
            onChange={(e) => setField("bio", e.target.value)}
          />
        </FieldContent>
        <div className="flex justify-between mt-1">
          {errors.bio ? (
            <FieldError>{errors.bio}</FieldError>
          ) : (
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
              Minimum {MIN_BIO_LENGTH} caractères
            </p>
          )}
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
            {values.bio.length} / {MAX_BIO_LENGTH}
          </p>
        </div>
      </Field>
    </div>
  )
}
