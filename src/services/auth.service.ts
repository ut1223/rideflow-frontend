import { apiClient } from "@/lib/axios";
import { ApiSuccessResponse } from "@/types/api";
import { AuthResponse, AuthTokens, LoginRequest, RegisterRequest } from "@/types/auth";
import { User } from "@/types/user";

export async function register(input: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
    "/auth/register",
    input
  );
  return data.data;
}

export async function login(input: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>("/auth/login", input);
  return data.data;
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<ApiSuccessResponse<AuthTokens>>("/auth/refresh", {
    refreshToken,
  });
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post<ApiSuccessResponse<null>>("/auth/logout");
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiSuccessResponse<User>>("/auth/me");
  return data.data;
}
