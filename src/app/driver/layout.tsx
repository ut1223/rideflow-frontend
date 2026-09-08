"use client";

import { ReactNode } from "react";
import {
  Bell,
  Car,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  LifeBuoy,
  UserRound,
  Wallet,
} from "lucide-react";
import { RoleGuard } from "@/components/common/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NavItem } from "@/components/layout/Sidebar";
import { DriverOnlineStatusSync } from "@/features/driver/DriverOnlineStatusSync";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/driver/dashboard", icon: LayoutDashboard },
  { label: "Ride Requests", href: "/driver/requests", icon: ClipboardList },
  { label: "Ride History", href: "/driver/rides", icon: History },
  { label: "Earnings", href: "/driver/earnings", icon: Wallet },
  { label: "Vehicles", href: "/driver/vehicles", icon: Car },
  { label: "Documents", href: "/driver/documents", icon: FileText },
  { label: "Notifications", href: "/driver/notifications", icon: Bell },
  { label: "Support", href: "/driver/support", icon: LifeBuoy },
  { label: "Profile", href: "/driver/profile", icon: UserRound },
];

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="DRIVER">
      <DriverOnlineStatusSync />
      <DashboardShell
        navItems={NAV_ITEMS}
        appName="Driver"
        notificationsHref="/driver/notifications"
        profileHref="/driver/profile"
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
