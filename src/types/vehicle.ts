export type VehicleType = "CAR" | "BIKE" | "AUTO";

export interface Vehicle {
  id: string;
  driverId: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  plateNumber: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}
