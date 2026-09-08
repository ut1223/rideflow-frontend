import { z } from "zod";

// Mirrors src/validators/auth.validator.ts on the backend — client-side only for UX;
// the backend remains the source of truth for validation.
export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  role: z.enum(["RIDER", "DRIVER"]),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
