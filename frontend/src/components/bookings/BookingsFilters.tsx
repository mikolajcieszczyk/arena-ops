"use client";

import { useState, useEffect } from "react";
import { BookingResponseDto } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface BookingsFiltersProps {
  bookings: BookingResponseDto[];
  onFilterChange: (filtered: BookingResponseDto[]) => void;
}

export function BookingsFilters({
  bookings,
  onFilterChange,
}: BookingsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: "all", label: "Wszystkie statusy" },
    { value: "pending", label: "Oczekujące" },
    { value: "confirmed", label: "Potwierdzone" },
    { value: "cancelled", label: "Anulowane" },
    { value: "completed", label: "Zakończone" },
    { value: "no_show", label: "Nie stawił się" },
  ];

  useEffect(() => {
    let filtered = [...bookings];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.id.toString().includes(searchTerm) ||
          booking.clientId.toString().includes(searchTerm) ||
          booking.courtId.toString().includes(searchTerm) ||
          booking.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.specialRequests
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    onFilterChange(filtered);
  }, [bookings, searchTerm, statusFilter, onFilterChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Szukaj rezerwacji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtry
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Wyczyść
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          Znaleziono {bookings.length} rezerwacji
        </div>
      )}
    </div>
  );
}
