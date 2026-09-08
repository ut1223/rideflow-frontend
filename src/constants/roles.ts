import { Role } from "@/types/user";

export const ROLES = {
  RIDER: "RIDER",
  DRIVER: "DRIVER",
  ADMIN: "ADMIN",
} as const satisfies Record<string, Role>;

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  RIDER: "/rider/dashboard",
  DRIVER: "/driver/dashboard",
  ADMIN: "/admin/dashboard",
};
