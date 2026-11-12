import { z } from "zod";

export const topicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(60, { error: "Name must be 60 characters or fewer" }),
});

export type TopicFormValues = z.infer<typeof topicFormSchema>;
