import { z } from "zod";

/** Mirrors the skill endpoints: name is required and the model tops it at 50. */
export const skillFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(50, { error: "Name must be 50 characters or fewer" }),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;
