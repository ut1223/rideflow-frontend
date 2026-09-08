import { PageHeader } from "@/components/common/PageHeader";
import { DriverProfilePage } from "@/features/driver/DriverProfilePage";

export default function DriverProfileRoute() {
  return (
    <div>
      <PageHeader title="Driver Profile" description="Manage your driver profile and location." />
      <DriverProfilePage />
    </div>
  );
}
