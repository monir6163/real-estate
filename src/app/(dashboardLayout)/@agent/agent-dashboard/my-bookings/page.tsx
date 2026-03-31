import { ownerBookings } from "@/actions/properties";
import MyBookings from "@/components/MyBookings";

export default async function MyBookingsPage() {
  const { data: bookings } = await ownerBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Bookings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage and respond to property booking requests
        </p>
      </div>

      <MyBookings bookings={bookings || []} />
    </div>
  );
}
