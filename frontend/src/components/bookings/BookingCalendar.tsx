"use client";

import { useState } from "react";
import { BookingResponseDto } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DayView } from "./DayView";
import { DatePicker } from "./DatePicker";
import { BookingModal } from "./BookingModal";

interface BookingCalendarProps {
  bookings: BookingResponseDto[];
}

// Konwertuje Date na string w formacie YYYY-MM-DD
const dateToISODateString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  // Ustaw dzisiejszą datę jako domyślną (bez godzin, minut i sekund)
  const [selectedDateISO, setSelectedDateISO] = useState(() =>
    dateToISODateString(new Date())
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponseDto | null>(null);

  const goToPreviousDay = () => {
    const date = new Date(selectedDateISO);
    date.setDate(date.getDate() - 1);
    setSelectedDateISO(dateToISODateString(date));
  };

  const goToNextDay = () => {
    const date = new Date(selectedDateISO);
    date.setDate(date.getDate() + 1);
    setSelectedDateISO(dateToISODateString(date));
  };

  const goToToday = () => {
    setSelectedDateISO(dateToISODateString(new Date()));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = [
      "Niedziela",
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
    ];
    const months = [
      "stycznia",
      "lutego",
      "marca",
      "kwietnia",
      "maja",
      "czerwca",
      "lipca",
      "sierpnia",
      "września",
      "października",
      "listopada",
      "grudnia",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  // Filtruj rezerwacje dla wybranego dnia
  const dayBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => {
        const bookingDate = booking?.startTime?.split("T")[0];
        const matches = bookingDate === selectedDateISO;
        console.log(
          `Porównuję datę rezerwacji ${bookingDate} z wybraną datą ${selectedDateISO}:`,
          matches
        );
        return matches;
      })
    : [];

  console.log("Wybrana data:", selectedDateISO);
  console.log("Wszystkie rezerwacje:", bookings);
  console.log("Przefiltrowane rezerwacje na wybrany dzień:", dayBookings);

  return (
    <div className="space-y-6">
      {/* Header z nawigacją */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Kalendarz rezerwacji
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDatePicker(true)}
                className="min-w-[200px] justify-between"
              >
                <span>{formatDate(selectedDateISO)}</span>
                <Calendar className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={goToToday}>
                Dzisiaj
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Widok dnia */}
      <Card className="py-0 border-none">
        <CardContent className="p-0">
          <DayView
            selectedDate={selectedDateISO}
            bookings={dayBookings}
            onBookingClick={setSelectedBooking}
          />
        </CardContent>
      </Card>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePicker
          selectedDate={new Date(selectedDateISO)}
          onDateSelect={(date) => {
            setSelectedDateISO(date.toISOString().split("T")[0]);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Booking Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSave={(updatedBooking) => {
            // TODO: Implement save logic
            console.log("Saving booking:", updatedBooking);
            setSelectedBooking(null);
          }}
          onDelete={(bookingId) => {
            // TODO: Implement delete logic
            console.log("Deleting booking:", bookingId);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}
