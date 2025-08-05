import { BookingResponseDto } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface BookingEventProps {
  booking: BookingResponseDto;
}

const statusConfig = {
  pending: {
    label: "Oczekująca",
    variant: "secondary" as const,
    color: "bg-yellow-100 border-yellow-300",
  },
  confirmed: {
    label: "Potwierdzona",
    variant: "default" as const,
    color: "bg-green-100 border-green-300",
  },
  cancelled: {
    label: "Anulowana",
    variant: "destructive" as const,
    color: "bg-red-100 border-red-300",
  },
  completed: {
    label: "Zakończona",
    variant: "outline" as const,
    color: "bg-gray-100 border-gray-300",
  },
  no_show: {
    label: "Nie stawił się",
    variant: "destructive" as const,
    color: "bg-red-100 border-red-300",
  },
};

export function BookingEvent({ booking }: BookingEventProps) {
  const status = statusConfig[booking.status as keyof typeof statusConfig];
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const duration = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  );

  return (
    <div
      className={`
      h-full p-2 rounded border-2 shadow-sm hover:shadow-md transition-shadow
      ${status.color}
      flex flex-col justify-between
    `}
    >
      <div className="space-y-1">
        {/* Status */}
        <div className="flex justify-between items-start">
          <Badge variant={status.variant} className="text-xs">
            {status.label}
          </Badge>
          <span className="text-xs font-medium text-gray-600">
            #{booking.id}
          </span>
        </div>

        {/* Czas */}
        <div className="text-xs font-semibold text-gray-800">
          {formatTime(startTime)} - {formatTime(endTime)}
        </div>

        {/* Czas trwania */}
        <div className="text-xs text-gray-600">{duration}h</div>
      </div>

      {/* Informacje o kliencie */}
      <div className="mt-2">
        <div className="text-xs font-medium text-gray-800">
          Klient #{booking.clientId}
        </div>

        {booking.notes && (
          <div className="text-xs text-gray-600 mt-1 truncate">
            {booking.notes}
          </div>
        )}

        {booking.totalPrice && (
          <div className="text-xs font-semibold text-green-700 mt-1">
            {booking.totalPrice} PLN
          </div>
        )}
      </div>
    </div>
  );
}
