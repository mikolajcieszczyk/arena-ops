import { BookingResponseDto } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

interface BookingCardProps {
  booking: BookingResponseDto;
}

const statusConfig = {
  pending: { label: "Oczekująca", variant: "secondary" as const },
  confirmed: { label: "Potwierdzona", variant: "default" as const },
  cancelled: { label: "Anulowana", variant: "destructive" as const },
  completed: { label: "Zakończona", variant: "outline" as const },
  no_show: { label: "Nie stawił się", variant: "destructive" as const },
};

export function BookingCard({ booking }: BookingCardProps) {
  const status = statusConfig[booking.status as keyof typeof statusConfig];
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const duration = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Rezerwacja #{booking.id}</CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(startDate)} - {formatTime(endDate)} ({duration}h)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Kort #{booking.courtId}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Klient #{booking.clientId}</span>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="text-sm text-gray-600">
            <strong>Notatki:</strong> {booking.notes}
          </div>
        )}

        {booking.totalPrice && (
          <div className="text-sm font-medium text-green-600">
            Cena: {booking.totalPrice} PLN
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/bookings/${booking.id}`}>
            <Button variant="outline" size="sm">
              Szczegóły
            </Button>
          </Link>
          <Link href={`/bookings/${booking.id}/edit`}>
            <Button variant="outline" size="sm">
              Edytuj
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
