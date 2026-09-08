"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { useUpdateProfileMutation } from "@/hooks/rider/useRiderProfile";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { UpdateProfileFormValues, updateProfileSchema } from "./profile.schemas";

export function ProfileForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const updateMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: user ? { name: user.name, phone: user.phone } : undefined,
  });

  function onSubmit(values: UpdateProfileFormValues) {
    updateMutation.mutate(values, {
      onSuccess: () => showToast("Profile updated successfully", "success"),
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4" noValidate>
      <Input label="Full name" error={errors.name?.message} {...register("name")} />
      <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
      <Input label="Email" value={user.email} disabled readOnly hint="Email cannot be changed." />
      <Button type="submit" isLoading={updateMutation.isPending} disabled={!isDirty}>
        Save Changes
      </Button>
    </form>
  );
}
