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

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponseDto | null>(null);

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filtruj rezerwacje dla wybranego dnia
  const dayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startTime);
    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

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
                <span>{formatDate(selectedDate)}</span>
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
      <Card>
        <CardContent className="p-0">
          <DayView
            date={selectedDate}
            bookings={dayBookings}
            onBookingClick={setSelectedBooking}
          />
        </CardContent>
      </Card>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
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
