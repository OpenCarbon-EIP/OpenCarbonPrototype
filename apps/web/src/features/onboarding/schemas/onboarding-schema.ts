import { z } from "zod";

export const ExpertiseEnum = {
  BILAN_CARBONE: "Bilan Carbone",
  ACV: "Analyse Cycle de Vie (ACV)",
  STRATEGIE_RSE: "Stratégie RSE",
  AUDIT_ENERGETIQUE: "Audit Énergétique",
  FINANCE_DURABLE: "Finance Durable",
} as const;

export type ExpertiseType = typeof ExpertiseEnum[keyof typeof ExpertiseEnum];

export const certificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Le nom de la certification est requis (min. 2 car.)"),
  year: z
    .number()
    .min(1900, "Année invalide")
    .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

export const missionProofSchema = z.object({
  id: z.string().uuid(),
  clientName: z.string().min(2, "Le nom du client est requis"),
  description: z.string().min(10, "Description trop courte (min. 10 car.)"),
  year: z.number().min(1900).max(new Date().getFullYear()),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

export const MIN_BIO_LENGTH = 20;
export const MAX_BIO_LENGTH = 500;

export const onboardingSchema = z.object({
  bio: z
    .string()
    .min(MIN_BIO_LENGTH, `Bio trop courte (min ${MIN_BIO_LENGTH} car.)`)
    .max(MAX_BIO_LENGTH, `Bio trop longue (max ${MAX_BIO_LENGTH} car.)`),
  expertise: z.nativeEnum(ExpertiseEnum, {
    errorMap: () => ({ message: "Veuillez sélectionner une expertise" }),
  }),
  certifications: z.array(certificationSchema).min(1, "Ajoutez au moins une certification"),
  missionProofs: z.array(missionProofSchema).min(1, "Ajoutez au moins une preuve de mission"),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
export type CertificationValues = z.infer<typeof certificationSchema>;
export type MissionProofValues = z.infer<typeof missionProofSchema>;
