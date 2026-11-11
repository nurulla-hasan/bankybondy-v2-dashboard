import { z } from "zod";

export const userPlans = ["Free", "Standard", "Premium"] as const;

/** Mirrors the audited admin override endpoint (reason is optional, max 500). */
export const changeUserPlanSchema = z.object({
  type: z.enum(userPlans),
  reason: z
    .string()
    .trim()
    .max(500, { error: "Reason must be 500 characters or fewer" }),
});

export type ChangeUserPlanValues = z.infer<typeof changeUserPlanSchema>;
