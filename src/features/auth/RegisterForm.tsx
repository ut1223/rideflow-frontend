"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useRegisterMutation } from "@/hooks/auth/useAuthMutations";
import { getErrorMessage } from "@/lib/utils";
import { RegisterFormValues, registerSchema } from "./auth.schemas";

export function RegisterForm({ defaultRole = "RIDER" }: { defaultRole?: "RIDER" | "DRIVER" }) {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Select
        label="I want to sign up as"
        options={[
          { label: "Rider", value: "RIDER" },
          { label: "Driver", value: "DRIVER" },
        ]}
        error={errors.role?.message}
        {...register("role")}
      />

      <Input
        label="Full name"
        autoComplete="name"
        placeholder="Jane Doe"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        type="tel"
        label="Phone"
        autoComplete="tel"
        placeholder="+919876543210"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {registerMutation.isError && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(registerMutation.error, "Registration failed. Please try again.")}
        </p>
      )}

      <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
        Create account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-slate-900 underline underline-offset-2">
          Log in
        </Link>
      </p>
    </form>
  );
}
