import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, { error: "Name is too short" }),
  contact: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { error: "Current password is required" }),
    newPassword: z.string().min(6, {
      error: "Password must be at least 6 characters",
    }),
    confirmNewPassword: z.string().min(6, {
      error: "Password must be at least 6 characters",
    }),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    error: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export const candidateModes = ["hybrid", "knn", "frontier"] as const;

export const matchingSettingsSchema = z.object({
  candidateMode: z.enum(candidateModes),
  cacheTtl: z.number().int().min(0).max(1440),
  surpriseFloor: z.number().min(0).max(1),
  surpriseMargin: z.number().min(0).max(1),
  frontierSeeds: z.number().int().min(1).max(200),
  sweepBatch: z.number().int().min(1).max(5000),
  sweepEnabled: z.boolean(),
  sweepCron: z.string().trim().min(1, { error: "Schedule is required" }),
});

export type MatchingSettingsType = z.infer<typeof matchingSettingsSchema>;

export const defaultMatchingSettings: MatchingSettingsType = {
  candidateMode: "hybrid",
  cacheTtl: 30,
  surpriseFloor: 0.35,
  surpriseMargin: 0.12,
  frontierSeeds: 24,
  sweepBatch: 500,
  sweepEnabled: true,
  sweepCron: "0 */6 * * *",
};
