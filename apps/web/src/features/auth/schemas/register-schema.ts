import { z } from "zod";

export const Role = {
  ENTREPRISE: "ENTREPRISE",
  CONSULTANT: "CONSULTANT",
} as const;

export type RoleType = keyof typeof Role;

const baseSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string().min(1, "La confirmation est requise"),
});

export const registerSchema = z
  .discriminatedUnion("role", [
    baseSchema.extend({
      role: z.literal(Role.ENTREPRISE),
      companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
    }),
    baseSchema.extend({
      role: z.literal(Role.CONSULTANT),
    }),
  ])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
