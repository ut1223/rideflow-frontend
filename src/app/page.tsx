"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(ROLE_HOME_ROUTE[user.role]);
    }
  }, [isAuthenticated, user, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-slate-900">RideFlow</span>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            RideFlow
          </h1>
          <p className="text-lg text-slate-500">Ride management made simple.</p>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <Link
            href="/register?role=RIDER"
            className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-slate-900 hover:shadow-md"
          >
            <UserRound className="h-8 w-8 text-slate-700" />
            <span className="text-base font-semibold text-slate-900">Continue as Rider</span>
            <span className="text-sm text-slate-500">Book rides and track them in real time.</span>
          </Link>
          <Link
            href="/register?role=DRIVER"
            className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-slate-900 hover:shadow-md"
          >
            <Car className="h-8 w-8 text-slate-700" />
            <span className="text-base font-semibold text-slate-900">Continue as Driver</span>
            <span className="text-sm text-slate-500">Go online and start accepting rides.</span>
          </Link>
        </div>

        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline underline-offset-2">
            Log in
          </Link>
        </p>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin sign in
        </Link>
      </footer>
    </div>
  );
}
