import { BookingResponseDto } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface BookingEventProps {
  booking: BookingResponseDto;
}

const statusConfig = {
  pending: {
    label: "Oczekująca",
    variant: "secondary" as const,
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
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

  // Zamiast tworzyć nowe obiekty Date, wyciągamy godziny i minuty bezpośrednio ze stringa
  const getTimeFromISOString = (isoString: string) => {
    const [hours, minutes] = isoString.split("T")[1].split(":").slice(0, 2);
    return `${hours}:${minutes}`;
  };

  const startTime = getTimeFromISOString(booking.startTime);
  const endTime = getTimeFromISOString(booking.endTime);

  // Oblicz czas trwania w godzinach
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);
  const duration = endHour - startHour;

  return (
    <div
      className={`
      h-full w-full p-2 rounded border-2 shadow-sm hover:shadow-md transition-shadow
      ${status.color}
      flex flex-col justify-between min-h-[60px] overflow-y-auto
    `}
    >
      <div className="space-y-0.5">
        {/* Status, ID i cena */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
            {booking.totalPrice && (
              <span className="text-xs font-semibold">
                {booking.totalPrice} PLN
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600">
            #{booking.id}
          </span>
        </div>

        {/* Czas */}
        <div className="text-xs font-semibold">
          {startTime} - {endTime}
        </div>

        {/* Czas trwania */}
        <div className="text-xs">{duration}h</div>
      </div>

      {/* Informacje o kliencie */}
      <div className="mt-1">
        <div className="text-xs font-medium">Klient #{booking.clientId}</div>

        {booking.notes && (
          <div className="text-xs mt-1 truncate">{booking.notes}</div>
        )}
      </div>
    </div>
  );
}
