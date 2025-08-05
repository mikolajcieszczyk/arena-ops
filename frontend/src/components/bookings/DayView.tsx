"use client";

import { BookingResponseDto } from "@/lib/api";
import { BookingEvent } from "./BookingEvent";

interface DayViewProps {
  date: Date;
  bookings: BookingResponseDto[];
  onBookingClick: (booking: BookingResponseDto) => void;
}

export function DayView({ bookings, onBookingClick }: DayViewProps) {
  // Generuj godziny od 00:00 do 23:00
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getBookingPosition = (booking: BookingResponseDto) => {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    // Pozycja Y (od góry) - na podstawie godziny
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;

    // Wysokość eventu (w godzinach)
    const duration = endHour - startHour;

    return {
      top: `${startHour * 60}px`, // 60px na godzinę
      height: `${duration * 60}px`,
      left: `${(booking.courtId - 1) * 200}px`, // 200px na kort
      width: "180px", // Szerokość eventu
    };
  };

  return (
    <div className="relative h-[1440px] overflow-y-auto border rounded-lg">
      {/* Nagłówek z kortami */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b">
        <div className="flex">
          <div className="w-20 h-12 flex items-center justify-center text-sm font-medium text-gray-600 border-r">
            Godzina
          </div>
          {[1, 2, 3].map((courtId) => (
            <div
              key={courtId}
              className="w-48 h-12 flex items-center justify-center text-sm font-medium text-gray-700 border-r"
            >
              Kort {courtId}
            </div>
          ))}
        </div>
      </div>

      {/* Siatka godzin */}
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex border-b border-gray-100">
            {/* Kolumna z godziną */}
            <div className="w-20 h-15 flex items-center justify-center text-xs text-gray-500 border-r bg-gray-50">
              {hour.toString().padStart(2, "0")}:00
            </div>

            {/* Kolumny kortów */}
            {[1, 2, 3].map((courtId) => (
              <div
                key={courtId}
                className="w-48 h-15 border-r border-gray-100 relative"
              />
            ))}
          </div>
        ))}

        {/* Eventy rezerwacji */}
        {bookings.map((booking) => {
          const position = getBookingPosition(booking);

          return (
            <div
              key={booking.id}
              className="absolute cursor-pointer"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
              }}
              onClick={() => onBookingClick(booking)}
            >
              <BookingEvent booking={booking} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
