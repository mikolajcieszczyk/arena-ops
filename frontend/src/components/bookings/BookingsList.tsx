"use client";

import { useState } from "react";
import { BookingResponseDto } from "@/lib/api";
import { BookingCalendar } from "./BookingCalendar";

const mockBookings: BookingResponseDto[] = Array.from({ length: 10 }).map(
  (_, i) => ({
    id: i + 1,
    clientId: 100 + i,
    courtId: (i % 3) + 1,
    startTime: new Date(Date.now() + i * 3600 * 1000 * 24).toISOString(),
    endTime: new Date(
      Date.now() + i * 3600 * 1000 * 24 + 2 * 3600 * 1000
    ).toISOString(),
    status: ["pending", "confirmed", "cancelled", "completed", "no_show"][
      i % 5
    ] as BookingResponseDto["status"],
    totalPrice: 100 + i * 10,
    notes: i % 2 === 0 ? `Notatka do rezerwacji #${i + 1}` : undefined,
    specialRequests: i % 3 === 0 ? "Potrzebne dodatkowe piłki" : undefined,
    createdAt: new Date(Date.now() - 1000000).toISOString(),
    updatedAt: new Date(Date.now() - 500000).toISOString(),
  })
);

export function BookingsList() {
  const [bookings] = useState<BookingResponseDto[]>(mockBookings);

  return <BookingCalendar bookings={bookings} />;
}
