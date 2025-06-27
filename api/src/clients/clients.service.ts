import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ClientResponseDto } from './dto/client-response.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    // Check if email already exists
    const existingClient = await this.clientRepository.findOne({
      where: { email: createClientDto.email },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);

    return this.mapToResponseDto(savedClient);
  }

  async findAll(): Promise<ClientResponseDto[]> {
    const clients = await this.clientRepository.find({
      order: { createdAt: 'DESC' },
    });

    return clients.map((client) => this.mapToResponseDto(client));
  }

  async findOne(id: number): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return this.mapToResponseDto(client);
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: updateClientDto.email },
      });

      if (existingClient) {
        throw new ConflictException('Client with this email already exists');
      }
    }

    // Update lastUpdate timestamp
    if (updateClientDto.lastUpdate) {
      client.updatedAt = new Date(updateClientDto.lastUpdate);
    }

    Object.assign(client, updateClientDto);
    const updatedClient = await this.clientRepository.save(client);

    return this.mapToResponseDto(updatedClient);
  }

  async remove(id: number): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    await this.clientRepository.remove(client);
  }

  private mapToResponseDto(client: Client): ClientResponseDto {
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      dateOfBirth: client.dateOfBirth,
      city: client.city,
      membershipType: client.membershipType,
      isActive: client.isActive,
      emergencyContact: client.emergencyContact,
      notes: client.notes,
      skillLevel: client.skillLevel,
      acceptsMarketing: client.acceptsMarketing,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
