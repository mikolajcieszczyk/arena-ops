import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { Court } from './entities/court.entity';
import { CourtResponseDto } from './dto/court-response.dto';

@Injectable()
export class CourtsService {
  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
  ) {}

  async create(createCourtDto: CreateCourtDto): Promise<CourtResponseDto> {
    // Check if court number already exists
    const existingCourt = await this.courtRepository.findOne({
      where: { courtNumber: createCourtDto.courtNumber },
    });

    if (existingCourt) {
      throw new ConflictException(
        `Court with number ${createCourtDto.courtNumber} already exists`,
      );
    }

    const court = this.courtRepository.create(createCourtDto);
    const savedCourt = await this.courtRepository.save(court);

    return this.mapToResponseDto(savedCourt);
  }

  async findAll(): Promise<CourtResponseDto[]> {
    const courts = await this.courtRepository.find({
      order: { courtNumber: 'ASC' },
    });

    return courts.map((court) => this.mapToResponseDto(court));
  }

  async findOne(id: number): Promise<CourtResponseDto> {
    const court = await this.courtRepository.findOne({
      where: { id },
    });

    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    return this.mapToResponseDto(court);
  }

  async update(
    id: number,
    updateCourtDto: UpdateCourtDto,
  ): Promise<CourtResponseDto> {
    const court = await this.courtRepository.findOne({
      where: { id },
    });

    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    // Check if court number is being updated and if it already exists
    if (
      updateCourtDto.courtNumber &&
      updateCourtDto.courtNumber !== court.courtNumber
    ) {
      const existingCourt = await this.courtRepository.findOne({
        where: { courtNumber: updateCourtDto.courtNumber },
      });

      if (existingCourt) {
        throw new ConflictException(
          `Court with number ${updateCourtDto.courtNumber} already exists`,
        );
      }
    }

    // Update lastUpdate timestamp
    if (updateCourtDto.lastUpdate) {
      court.updatedAt = new Date(updateCourtDto.lastUpdate);
    }

    // Remove id from updateCourtDto to prevent overwriting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, lastUpdate: __, ...updateData } = updateCourtDto;

    // Merge update data with existing court
    Object.assign(court, updateData);

    const updatedCourt = await this.courtRepository.save(court);

    return this.mapToResponseDto(updatedCourt);
  }

  async remove(id: number): Promise<void> {
    const court = await this.courtRepository.findOne({
      where: { id },
    });

    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    await this.courtRepository.remove(court);
  }

  private mapToResponseDto(court: Court): CourtResponseDto {
    return {
      id: court.id,
      name: court.name,
      description: court.description,
      surface: court.surface,
      type: court.type,
      courtNumber: court.courtNumber,
      isAvailable: court.isAvailable,
      hourlyRate: court.hourlyRate,
      location: court.location,
      notes: court.notes,
      createdAt: court.createdAt,
      updatedAt: court.updatedAt,
    };
  }
}
