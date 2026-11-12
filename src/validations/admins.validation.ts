import { z } from "zod";

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(80, { error: "Name must be 80 characters or fewer" }),
  email: z.email({ error: "Invalid email address" }),
  phoneNumber: z
    .string()
    .trim()
    .max(20, { error: "Phone number must be 20 characters or fewer" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

export const updateAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(80, { error: "Name must be 80 characters or fewer" }),
  // Disabled in the edit form; the API rejects any real change server-side.
  email: z.email({ error: "Invalid email address" }),
  phoneNumber: z
    .string()
    .trim()
    .max(20, { error: "Phone number must be 20 characters or fewer" }),
  // Blank means "keep the current password".
  password: z
    .string()
    .refine((value) => value === "" || value.length >= 6, {
      error: "Password must be at least 6 characters",
    }),
});

export type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>;
