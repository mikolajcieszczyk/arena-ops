/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateBookingDto = {
    /**
     * ID of the client making the booking
     */
    clientId?: number;
    /**
     * ID of the court being booked
     */
    courtId?: number;
    /**
     * Start time of the booking (ISO 8601 format)
     */
    startTime?: string;
    /**
     * End time of the booking (ISO 8601 format)
     */
    endTime?: string;
    /**
     * Status of the booking
     */
    status?: UpdateBookingDto.status;
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
};
export namespace UpdateBookingDto {
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

