import { apiClient } from "@/lib/axios";
import { ApiSuccessResponse } from "@/types/api";
import { Vehicle, VehicleType } from "@/types/vehicle";

export interface CreateVehicleInput {
  vehicleType: VehicleType;
  brand: string;
  model: string;
  plateNumber: string;
  color: string;
}

export interface UpdateVehicleInput {
  vehicleType?: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
}

export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.post<ApiSuccessResponse<Vehicle>>("/vehicles", input);
  return data.data;
}

export async function listVehicles(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Vehicle[]>>("/vehicles");
  return data.data;
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const { data } = await apiClient.get<ApiSuccessResponse<Vehicle>>(`/vehicles/${id}`);
  return data.data;
}

export async function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Vehicle>>(`/vehicles/${id}`, input);
  return data.data;
}

export async function deleteVehicle(id: string): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}
