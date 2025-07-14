import { useState, useCallback } from "react";
import {
  BookingsService,
  CreateBookingDto,
  UpdateBookingDto,
  BookingResponseDto,
} from "../lib/api";

export const useBookingsApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(
    async (data: CreateBookingDto): Promise<BookingResponseDto | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await BookingsService.bookingsControllerCreate(data);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getBookings = useCallback(async (): Promise<
    BookingResponseDto[] | null
  > => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await BookingsService.bookingsControllerFindAll();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBooking = useCallback(
    async (id: number): Promise<BookingResponseDto | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await BookingsService.bookingsControllerFindOne(id);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateBooking = useCallback(
    async (
      id: number,
      data: UpdateBookingDto
    ): Promise<BookingResponseDto | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await BookingsService.bookingsControllerUpdate(id, data);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteBooking = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await BookingsService.bookingsControllerRemove(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking,
  };
};
