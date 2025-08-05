import { Suspense } from "react";
import { BookingsList } from "@/components/bookings/BookingsList";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookingsHeader />
      <Suspense fallback={<BookingsListSkeleton />}>
        <BookingsList />
      </Suspense>
    </div>
  );
}

function BookingsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
