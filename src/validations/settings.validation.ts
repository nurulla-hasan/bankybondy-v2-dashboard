import { z } from "zod";
import type {
  MatchingSettings,
  MatchingSettingsValues,
  UpdateMatchingSettingsPayload,
} from "@/types";

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

export const candidateModes = ["vector", "knn"] as const;

export const matchingSettingsSchema = z.object({
  candidateMode: z.enum(candidateModes),
  frontierEnabled: z.boolean(),
  cacheTtlMinutes: z.number().int().min(0).max(43200),
  surpriseFloor: z.number().min(0).max(1),
  surpriseMargin: z.number().min(0).max(1),
  frontierSeeds: z.number().int().min(1).max(20),
  sweepBatch: z.number().int().min(1).max(20000),
  sweepEnabled: z.boolean(),
  // Cron syntax (including optional seconds) is validated by the server.
  sweepCron: z.string().trim().min(1, { error: "Schedule is required" }).max(120),
}) satisfies z.ZodType<MatchingSettingsValues>;

export type MatchingSettingsType = z.infer<typeof matchingSettingsSchema>;

/** Normalize the draft and allowlist changed values; never send audit metadata. */
export function createMatchingSettingsPatch(
  opening: MatchingSettings,
  draft: MatchingSettingsValues,
): UpdateMatchingSettingsPayload | null {
  const values = matchingSettingsSchema.parse(draft);
  const changes = Object.fromEntries(
    matchingSettingsSchema.keyof().options
      .filter((key) => values[key] !== opening[key])
      .map((key) => [key, values[key]]),
  );

  return Object.keys(changes).length
    ? { expectedRevision: opening.revision, ...changes }
    : null;
}
