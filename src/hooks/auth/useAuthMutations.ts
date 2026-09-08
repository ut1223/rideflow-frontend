"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as authService from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import { LoginRequest, RegisterRequest } from "@/types/auth";

export function useLoginMutation() {
  const { applySession } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginRequest) => authService.login(input),
    onSuccess: (auth) => {
      applySession(auth);
      router.replace(ROLE_HOME_ROUTE[auth.user.role]);
    },
  });
}

export function useRegisterMutation() {
  const { applySession } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterRequest) => authService.register(input),
    onSuccess: (auth) => {
      applySession(auth);
      router.replace(ROLE_HOME_ROUTE[auth.user.role]);
    },
  });
}
