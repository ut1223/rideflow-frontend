export type Role = "RIDER" | "DRIVER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Pick<User, "id" | "name" | "email" | "phone" | "status">;
