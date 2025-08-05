"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  onClose,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    // Dodaj puste dni na początku
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Dodaj dni miesiąca
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wybierz datę</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nagłówek miesiąca */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h3 className="text-lg font-semibold">
              {formatMonth(currentMonth)}
            </h3>

            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dni tygodnia */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600">
            {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((day) => (
              <div key={day} className="p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Kalendarz */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="p-1">
                {day ? (
                  <Button
                    variant={isSelected(day) ? "default" : "outline"}
                    size="sm"
                    className={`
                      w-full h-8 text-sm
                      ${isToday(day) ? "ring-2 ring-blue-500" : ""}
                      ${isSelected(day) ? "bg-blue-600 text-white" : ""}
                    `}
                    onClick={() => onDateSelect(day)}
                  >
                    {day.getDate()}
                  </Button>
                ) : (
                  <div className="w-full h-8" />
                )}
              </div>
            ))}
          </div>

          {/* Przyciski akcji */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            <Button onClick={() => onDateSelect(today)}>Dzisiaj</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
