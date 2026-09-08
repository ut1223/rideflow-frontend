import { PageHeader } from "@/components/common/PageHeader";
import { ProfileForm } from "@/features/rider/ProfileForm";

export default function RiderProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" description="Manage your account information." />
      <ProfileForm />
    </div>
  );
}
