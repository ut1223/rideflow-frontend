import { z } from "zod";

// Mirrors src/validators/support.validator.ts createTicketSchema.
export const createTicketSchema = z.object({
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200),
  description: z.string().trim().min(3, "Description must be at least 3 characters").max(2000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
