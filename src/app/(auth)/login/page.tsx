import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-500">Log in to your RideFlow account.</p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
