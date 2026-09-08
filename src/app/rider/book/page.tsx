import { PageHeader } from "@/components/common/PageHeader";
import { BookRideForm } from "@/features/rider/BookRideForm";

export default function BookRidePage() {
  return (
    <div>
      <PageHeader title="Book a Ride" description="Estimate your fare and request a ride." />
      <BookRideForm />
    </div>
  );
}
