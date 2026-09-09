"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Car, ShieldCheck, Sparkles, UserRound } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,#0f172a0d_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute -top-32 -left-24 h-96 w-96 animate-[blob_9s_ease-in-out_infinite] rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-32 -right-24 h-96 w-96 animate-[blob_9s_ease-in-out_infinite] rounded-full bg-sky-300/30 blur-3xl [animation-delay:2.5s]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-[blob_9s_ease-in-out_infinite] rounded-full bg-violet-300/25 blur-3xl [animation-delay:5s]" />
      </div>

      <header className="relative z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <Car className="h-4 w-4" />
            </span>
            RideFlow
          </span>
          <Link
            href="/login"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <div className="animate-[fade-up_0.7s_ease-out_forwards] space-y-4 opacity-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Rides, reimagined
          </span>
          <h1 className="bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            RideFlow
          </h1>
          <p className="text-lg text-slate-500">Ride management made simple.</p>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <Link
            href="/register?role=RIDER"
            className="group relative flex animate-[fade-up_0.7s_ease-out_forwards] flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-8 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 [animation-delay:150ms] hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100"
          >
            <ArrowRight className="absolute top-4 right-4 h-4 w-4 -translate-x-1 text-indigo-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
              <UserRound className="h-7 w-7" />
            </span>
            <span className="text-base font-semibold text-slate-900">Continue as Rider</span>
            <span className="text-sm text-slate-500">Book rides and track them in real time.</span>
          </Link>
          <Link
            href="/register?role=DRIVER"
            className="group relative flex animate-[fade-up_0.7s_ease-out_forwards] flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-8 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 [animation-delay:250ms] hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100"
          >
            <ArrowRight className="absolute top-4 right-4 h-4 w-4 -translate-x-1 text-violet-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
              <Car className="h-7 w-7" />
            </span>
            <span className="text-base font-semibold text-slate-900">Continue as Driver</span>
            <span className="text-sm text-slate-500">Go online and start accepting rides.</span>
          </Link>
        </div>

        <p className="animate-[fade-up_0.7s_ease-out_forwards] text-sm text-slate-500 opacity-0 [animation-delay:350ms]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-slate-900 underline underline-offset-2 hover:text-indigo-700"
          >
            Log in
          </Link>
        </p>
      </main>

      <footer className="relative z-10 border-t border-slate-200/70 py-4 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-700"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin sign in
        </Link>
      </footer>
    </div>
  );
}
