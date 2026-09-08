"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useUpdateVehicleMutation } from "@/hooks/driver/useVehicles";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { UpdateVehicleFormValues, updateVehicleSchema } from "./driver.schemas";
import { Vehicle } from "@/types/vehicle";

const VEHICLE_TYPE_OPTIONS = [
  { label: "Car", value: "CAR" },
  { label: "Bike", value: "BIKE" },
  { label: "Auto", value: "AUTO" },
];

export function EditVehicleForm({ vehicle, onSuccess }: { vehicle: Vehicle; onSuccess: () => void }) {
  const { showToast } = useToast();
  const updateMutation = useUpdateVehicleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateVehicleFormValues>({
    resolver: zodResolver(updateVehicleSchema),
    defaultValues: {
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color,
    },
  });

  function onSubmit(values: UpdateVehicleFormValues) {
    updateMutation.mutate(
      { id: vehicle.id, input: values },
      {
        onSuccess: () => {
          showToast("Vehicle updated successfully", "success");
          onSuccess();
        },
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Select
        label="Vehicle type"
        options={VEHICLE_TYPE_OPTIONS}
        error={errors.vehicleType?.message}
        {...register("vehicleType")}
      />
      <Input label="Brand" error={errors.brand?.message} {...register("brand")} />
      <Input label="Model" error={errors.model?.message} {...register("model")} />
      <Input label="Plate number" value={vehicle.plateNumber} disabled readOnly hint="Plate number can't be changed." />
      <Input label="Color" error={errors.color?.message} {...register("color")} />
      <Button type="submit" className="w-full" isLoading={updateMutation.isPending}>
        Save Changes
      </Button>
    </form>
  );
}
