"use client";

import { ReactNode } from "react";
import { Bell, History, LayoutDashboard, LifeBuoy, PlusCircle, UserRound, Wallet } from "lucide-react";
import { RoleGuard } from "@/components/common/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/rider/dashboard", icon: LayoutDashboard },
  { label: "Book Ride", href: "/rider/book", icon: PlusCircle },
  { label: "My Rides", href: "/rider/rides", icon: History },
  { label: "Payments", href: "/rider/payments", icon: Wallet },
  { label: "Notifications", href: "/rider/notifications", icon: Bell },
  { label: "Support", href: "/rider/support", icon: LifeBuoy },
  { label: "Profile", href: "/rider/profile", icon: UserRound },
];

export default function RiderLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="RIDER">
      <DashboardShell
        navItems={NAV_ITEMS}
        appName="Rider"
        notificationsHref="/rider/notifications"
        profileHref="/rider/profile"
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
