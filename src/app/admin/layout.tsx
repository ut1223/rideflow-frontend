"use client";

import { ReactNode } from "react";
import { Car, LayoutDashboard, LifeBuoy, Navigation, UserRound, Users, Wallet } from "lucide-react";
import { RoleGuard } from "@/components/common/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Riders", href: "/admin/riders", icon: UserRound },
  { label: "Drivers", href: "/admin/drivers", icon: Car },
  { label: "Rides", href: "/admin/rides", icon: Navigation },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="ADMIN">
      <DashboardShell navItems={NAV_ITEMS} appName="Admin">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
