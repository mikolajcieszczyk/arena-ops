import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto, BookingStatus } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    // Validate that start time is before end time
    const startTime = new Date(createBookingDto.startTime);
    const endTime = new Date(createBookingDto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for overlapping bookings on the same court
    const overlappingBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.courtId = :courtId', {
        courtId: createBookingDto.courtId,
      })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        {
          startTime: startTime,
          endTime: endTime,
        },
      )
      .getOne();

    if (overlappingBooking) {
      throw new ConflictException(
        'Court is already booked for this time period',
      );
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      startTime: startTime,
      endTime: endTime,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    return this.mapToResponseDto(savedBooking);
  }

  async findAll(): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingRepository.find({
      order: { startTime: 'ASC' },
    });

    return bookings.map((booking) => this.mapToResponseDto(booking));
  }

  async findOne(id: number): Promise<BookingResponseDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return this.mapToResponseDto(booking);
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Validate time changes if provided
    if (updateBookingDto.startTime || updateBookingDto.endTime) {
      const startTime = updateBookingDto.startTime
        ? new Date(updateBookingDto.startTime)
        : booking.startTime;
      const endTime = updateBookingDto.endTime
        ? new Date(updateBookingDto.endTime)
        : booking.endTime;

      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      // Check for overlapping bookings (excluding current booking)
      const overlappingBooking = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.courtId = :courtId', {
          courtId: updateBookingDto.courtId || booking.courtId,
        })
        .andWhere('booking.status = :status', {
          status: BookingStatus.CONFIRMED,
        })
        .andWhere('booking.id != :bookingId', { bookingId: id })
        .andWhere(
          '(booking.startTime < :endTime AND booking.endTime > :startTime)',
          {
            startTime: startTime,
            endTime: endTime,
          },
        )
        .getOne();

      if (overlappingBooking) {
        throw new ConflictException(
          'Court is already booked for this time period',
        );
      }
    }

    // Merge update data with existing booking
    Object.assign(booking, updateBookingDto);

    const updatedBooking = await this.bookingRepository.save(booking);

    return this.mapToResponseDto(updatedBooking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    await this.bookingRepository.remove(booking);
  }

  private mapToResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      clientId: booking.clientId,
      courtId: booking.courtId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }
}
