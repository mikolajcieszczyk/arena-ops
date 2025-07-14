/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookingResponseDto } from '../models/BookingResponseDto';
import type { CreateBookingDto } from '../models/CreateBookingDto';
import type { UpdateBookingDto } from '../models/UpdateBookingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookingsService {
    /**
     * Create a new booking
     * @param requestBody
     * @returns BookingResponseDto Booking created successfully
     * @throws ApiError
     */
    public static bookingsControllerCreate(
        requestBody: CreateBookingDto,
    ): CancelablePromise<BookingResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - invalid data provided`,
            },
        });
    }
    /**
     * Get all bookings
     * @returns BookingResponseDto List of all bookings
     * @throws ApiError
     */
    public static bookingsControllerFindAll(): CancelablePromise<Array<BookingResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bookings',
        });
    }
    /**
     * Get a booking by ID
     * @param id Booking ID
     * @returns BookingResponseDto Booking found
     * @throws ApiError
     */
    public static bookingsControllerFindOne(
        id: number,
    ): CancelablePromise<BookingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bookings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Booking not found`,
            },
        });
    }
    /**
     * Update a booking
     * @param id Booking ID
     * @param requestBody
     * @returns BookingResponseDto Booking updated successfully
     * @throws ApiError
     */
    public static bookingsControllerUpdate(
        id: number,
        requestBody: UpdateBookingDto,
    ): CancelablePromise<BookingResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/bookings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Booking not found`,
            },
        });
    }
    /**
     * Delete a booking
     * @param id Booking ID
     * @returns void
     * @throws ApiError
     */
    public static bookingsControllerRemove(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/bookings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Booking not found`,
            },
        });
    }
}
