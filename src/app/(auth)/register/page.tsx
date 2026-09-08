import { RegisterForm } from "@/features/auth/RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const defaultRole = params.role === "DRIVER" ? "DRIVER" : "RIDER";

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Join RideFlow in a few seconds.</p>
      <div className="mt-6">
        <RegisterForm defaultRole={defaultRole} />
      </div>
    </div>
  );
}
