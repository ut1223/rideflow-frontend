import { z } from "zod";

// Mirrors src/validators/driver.validator.ts
export const createDriverProfileSchema = z.object({
  licenseNumber: z.string().trim().min(4, "License number must be at least 4 characters").max(50),
});
export type CreateDriverProfileFormValues = z.infer<typeof createDriverProfileSchema>;

export const updateLocationSchema = z.object({
  currentLatitude: z.number().min(-90, "Enter a valid latitude").max(90, "Enter a valid latitude"),
  currentLongitude: z
    .number()
    .min(-180, "Enter a valid longitude")
    .max(180, "Enter a valid longitude"),
});
export type UpdateLocationFormValues = z.infer<typeof updateLocationSchema>;

export const addDocumentSchema = z.object({
  documentType: z.enum(["DRIVING_LICENSE", "VEHICLE_RC", "INSURANCE", "IDENTITY_PROOF"]),
  documentUrl: z.string().trim().url("Enter a valid URL"),
});
export type AddDocumentFormValues = z.infer<typeof addDocumentSchema>;

// plateNumber is create-only — src/validators/vehicle.validator.ts's updateVehicleSchema
// deliberately omits it (plate numbers aren't editable after creation).
export const createVehicleSchema = z.object({
  vehicleType: z.enum(["CAR", "BIKE", "AUTO"]),
  brand: z.string().trim().min(1, "Brand is required").max(50),
  model: z.string().trim().min(1, "Model is required").max(50),
  plateNumber: z.string().trim().min(3, "Plate number must be at least 3 characters").max(20),
  color: z.string().trim().min(1, "Color is required").max(30),
});
export type CreateVehicleFormValues = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = z.object({
  vehicleType: z.enum(["CAR", "BIKE", "AUTO"]),
  brand: z.string().trim().min(1, "Brand is required").max(50),
  model: z.string().trim().min(1, "Model is required").max(50),
  color: z.string().trim().min(1, "Color is required").max(30),
});
export type UpdateVehicleFormValues = z.infer<typeof updateVehicleSchema>;
