"use client";

import { useEffect, useState } from "react";
import { BookingResponseDto } from "@/lib/api";
import { BookingCalendar } from "./BookingCalendar";
import { useBookingsApi } from "@/hooks/use-api";
import "@/lib/api-client";

export function BookingsList() {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const { getBookings, isLoading, error } = useBookingsApi();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getBookings();
        console.log("Pobrane rezerwacje z API:", result);
        setBookings(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      }
    };

    fetchBookings();
  }, [getBookings]);

  if (isLoading && bookings.length === 0) {
    return <div className="p-4 text-center">Ładowanie rezerwacji...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Błąd podczas ładowania rezerwacji: {error}
      </div>
    );
  }

  return <BookingCalendar bookings={bookings} />;
}
