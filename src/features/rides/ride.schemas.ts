import { z } from "zod";

// Mirrors src/validators/ride.validator.ts (estimateRideSchema + createRideSchema combined,
// since the booking form collects address text alongside coordinates in one step).
// Plain z.number() (not z.coerce) so the form's field type stays `number` — inputs use
// RHF's valueAsNumber to convert the HTML input string before validation runs.
const latitude = z.number().min(-90, "Enter a valid latitude").max(90, "Enter a valid latitude");
const longitude = z.number().min(-180, "Enter a valid longitude").max(180, "Enter a valid longitude");

export const bookRideSchema = z.object({
  pickupAddress: z.string().trim().min(1, "Pickup address is required").max(255),
  destinationAddress: z.string().trim().min(1, "Destination address is required").max(255),
  pickupLatitude: latitude,
  pickupLongitude: longitude,
  destinationLatitude: latitude,
  destinationLongitude: longitude,
});

export type BookRideFormValues = z.infer<typeof bookRideSchema>;

export const cancelRideSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export type CancelRideFormValues = z.infer<typeof cancelRideSchema>;
