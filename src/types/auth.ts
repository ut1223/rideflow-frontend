import { Role, User } from "./user";

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: Extract<Role, "RIDER" | "DRIVER">;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
