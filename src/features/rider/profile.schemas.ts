import { z } from "zod";

// Mirrors src/validators/user.validator.ts updateProfileSchema (both fields required here
// since the edit form is always pre-filled — clearing them isn't a supported flow).
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
