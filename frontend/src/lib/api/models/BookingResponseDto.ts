/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BookingResponseDto = {
    /**
     * Unique identifier for the booking
     */
    id: number;
    /**
     * ID of the client making the booking
     */
    clientId: number;
    /**
     * ID of the court being booked
     */
    courtId: number;
    /**
     * Start time of the booking
     */
    startTime: string;
    /**
     * End time of the booking
     */
    endTime: string;
    /**
     * Status of the booking
     */
    status: BookingResponseDto.status;
    /**
     * Total price of the booking
     */
    totalPrice?: number;
    /**
     * Additional notes for the booking
     */
    notes?: string;
    /**
     * Special requests for the booking
     */
    specialRequests?: string;
    /**
     * Date when the booking was created
     */
    createdAt: string;
    /**
     * Date when the booking was last updated
     */
    updatedAt: string;
};
export namespace BookingResponseDto {
    /**
     * Status of the booking
     */
    export enum status {
        PENDING = 'pending',
        CONFIRMED = 'confirmed',
        CANCELLED = 'cancelled',
        COMPLETED = 'completed',
        NO_SHOW = 'no_show',
    }
}

