"use client";

import React from "react";
import { BookingResponseDto } from "@/lib/api";
import { BookingEvent } from "./BookingEvent";

interface DayViewProps {
  selectedDate: string;
  bookings: BookingResponseDto[];
  onBookingClick: (booking: BookingResponseDto) => void;
}

export function DayView({ bookings, onBookingClick }: DayViewProps) {
  // Generuj godziny od 00:00 do 23:00
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getBookingPosition = (booking: BookingResponseDto) => {
    // Wyciągnij godziny i minuty ze stringów ISO
    const [startHour, startMinute] = booking.startTime
      .split("T")[1]
      .split(":")
      .slice(0, 2);
    const [endHour, endMinute] = booking.endTime
      .split("T")[1]
      .split(":")
      .slice(0, 2);

    // Konwertuj na liczby
    const startHourNum = parseInt(startHour);
    const startMinuteNum = parseInt(startMinute);
    const endHourNum = parseInt(endHour);
    const endMinuteNum = parseInt(endMinute);

    // Oblicz pozycję i wysokość
    const startPosition = startHourNum * 60 + startMinuteNum;
    const endPosition = endHourNum * 60 + endMinuteNum;
    const duration = endPosition - startPosition;

    return {
      top: `${startPosition}px`,
      height: `${duration}px`,
      left: "8px", // Dodajemy margines z lewej
      width: "calc(100% - 16px)", // Odejmujemy marginesy z obu stron
    };
  };

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[600px] w-full">
          {/* Grid container */}
          <div className="grid grid-cols-[80px_repeat(3,1fr)]">
            {/* Nagłówek */}
            <div className="sticky top-0 z-10 bg-gray-50 col-span-4 grid grid-cols-[80px_repeat(3,1fr)]">
              <div className="h-10 flex items-center justify-center text-sm font-medium text-gray-600 border-r border-b border-gray-200 bg-gray-50">
                Godzina
              </div>
              {[1, 2, 3].map((courtId) => (
                <div
                  key={courtId}
                  className="h-10 flex items-center justify-center text-sm font-medium text-gray-700 border-r border-b border-gray-200 last:border-r-0"
                >
                  Kort {courtId}
                </div>
              ))}
            </div>

            {/* Siatka godzin */}
            <div className="col-span-4 grid grid-cols-[80px_repeat(3,1fr)] relative">
              {hours.map((hour) => (
                <div key={hour} className="contents">
                  {/* Kolumna z godziną */}
                  <div className="h-[60px] flex items-center justify-center text-xs text-gray-500 border-r border-b border-gray-200 bg-gray-50">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  {/* Kolumny kortów */}
                  {[1, 2, 3].map((courtId) => (
                    <div
                      key={`${hour}-${courtId}`}
                      className="h-[60px] border-r border-b border-gray-200 last:border-r-0 relative"
                    >
                      {/* Rezerwacje dla tego kortu i godziny */}
                      {bookings
                        .filter(
                          (booking) =>
                            booking.courtId === courtId &&
                            parseInt(
                              booking.startTime.split("T")[1].split(":")[0]
                            ) === hour
                        )
                        .map((booking) => {
                          const position = getBookingPosition(booking);
                          return (
                            <div
                              key={booking.id}
                              className="absolute w-full"
                              style={{
                                top: position.top,
                                height: position.height,
                              }}
                              onClick={() => onBookingClick(booking)}
                            >
                              <BookingEvent booking={booking} />
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
