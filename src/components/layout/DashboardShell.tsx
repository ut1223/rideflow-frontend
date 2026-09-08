"use client";

import { ReactNode, useState } from "react";
import { NavItem, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({
  navItems,
  appName,
  notificationsHref,
  profileHref,
  children,
}: {
  navItems: NavItem[];
  appName: string;
  notificationsHref?: string;
  profileHref?: string;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        navItems={navItems}
        appName={appName}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          notificationsHref={notificationsHref}
          profileHref={profileHref}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
