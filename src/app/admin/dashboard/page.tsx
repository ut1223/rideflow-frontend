"use client";

import {
  Activity,
  Car,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { useAdminDashboardQuery } from "@/hooks/admin/useAdmin";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";

const STAT_ICON_CLASSES = "flex h-11 w-11 items-center justify-center rounded-full";

export default function AdminDashboardPage() {
  const dashboardQuery = useAdminDashboardQuery();

  return (
    <div>
      <PageHeader title="Dashboard" description="Live platform metrics." />

      {dashboardQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : dashboardQuery.isError ? (
        <ErrorState error={dashboardQuery.error} onRetry={() => dashboardQuery.refetch()} />
      ) : dashboardQuery.data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            iconClass="bg-slate-100 text-slate-600"
            label="Total Users"
            value={dashboardQuery.data.totalUsers}
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            iconClass="bg-blue-50 text-blue-600"
            label="Riders"
            value={dashboardQuery.data.totalRiders}
          />
          <StatCard
            icon={<Car className="h-5 w-5" />}
            iconClass="bg-indigo-50 text-indigo-600"
            label="Drivers"
            value={dashboardQuery.data.totalDrivers}
          />
          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600"
            label="Verified Drivers"
            value={dashboardQuery.data.verifiedDrivers}
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            iconClass="bg-teal-50 text-teal-600"
            label="Active Drivers"
            value={dashboardQuery.data.activeDrivers}
          />
          <StatCard
            icon={<Navigation className="h-5 w-5" />}
            iconClass="bg-violet-50 text-violet-600"
            label="Total Rides"
            value={dashboardQuery.data.totalRides}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600"
            label="Completed Rides"
            value={dashboardQuery.data.completedRides}
          />
          <StatCard
            icon={<XCircle className="h-5 w-5" />}
            iconClass="bg-red-50 text-red-600"
            label="Cancelled Rides"
            value={dashboardQuery.data.cancelledRides}
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-600"
            label="Active Rides"
            value={dashboardQuery.data.activeRides}
          />
          <StatCard
            icon={<Wallet className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600"
            label="Total Revenue"
            value={formatCurrency(dashboardQuery.data.totalRevenue)}
          />
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div className={`${STAT_ICON_CLASSES} ${iconClass}`}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
