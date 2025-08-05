"use client";

import { useState } from "react";
import { BookingResponseDto, UpdateBookingDto } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save } from "lucide-react";

interface BookingModalProps {
  booking: BookingResponseDto;
  onClose: () => void;
  onSave: (booking: UpdateBookingDto) => void;
  onDelete: (bookingId: number) => void;
}

const statusConfig = {
  pending: { label: "Oczekująca", variant: "secondary" as const },
  confirmed: { label: "Potwierdzona", variant: "default" as const },
  cancelled: { label: "Anulowana", variant: "destructive" as const },
  completed: { label: "Zakończona", variant: "outline" as const },
  no_show: { label: "Nie stawił się", variant: "destructive" as const },
};

export function BookingModal({
  booking,
  onClose,
  onSave,
  onDelete,
}: BookingModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const status = statusConfig[booking.status as keyof typeof statusConfig];

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const duration = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      onDelete(booking.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Rezerwacja #{booking.id}
            <Badge variant={status.variant}>{status.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Szczegóły rezerwacji */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Data rozpoczęcia
                </label>
                <p className="text-sm">{formatDateTime(startTime)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Data zakończenia
                </label>
                <p className="text-sm">{formatDateTime(endTime)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Czas trwania
                </label>
                <p className="text-sm">{duration} godzin</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Kort
                </label>
                <p className="text-sm">#{booking.courtId}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Klient
              </label>
              <p className="text-sm">#{booking.clientId}</p>
            </div>

            {booking.totalPrice && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Cena
                </label>
                <p className="text-sm font-semibold text-green-600">
                  {booking.totalPrice} PLN
                </p>
              </div>
            )}

            {booking.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Notatki
                </label>
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}

            {booking.specialRequests && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Specjalne prośby
                </label>
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Przyciski akcji */}
          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Zamknij
              </Button>
              <Button
                onClick={() => onSave(booking)}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Zapisz zmiany
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
