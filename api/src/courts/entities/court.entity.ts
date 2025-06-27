import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourtSurface, CourtType } from '../dto/create-court.dto';

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CourtSurface,
  })
  surface: CourtSurface;

  @Column({
    type: 'enum',
    enum: CourtType,
  })
  type: CourtType;

  @Column()
  courtNumber: number;

  @Column({ default: true })
  isAvailable?: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
