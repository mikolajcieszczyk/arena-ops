import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function BookingsHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rezerwacje</h1>
        <p className="text-gray-600 mt-2">
          Zarządzaj rezerwacjami kortów tenisowych
        </p>
      </div>
      <Link href="/bookings/new">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nowa rezerwacja
        </Button>
      </Link>
    </div>
  );
}
