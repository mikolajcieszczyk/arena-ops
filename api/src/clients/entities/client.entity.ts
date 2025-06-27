import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MembershipType, NTRPLevel } from '../dto/create-client.dto';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({
    type: 'enum',
    enum: MembershipType,
    default: MembershipType.NONE,
  })
  membershipType?: MembershipType;

  @Column({ default: true })
  isActive?: boolean;

  @Column({ nullable: true })
  emergencyContact?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: NTRPLevel,
    nullable: true,
  })
  skillLevel?: NTRPLevel;

  @Column({ default: false })
  acceptsMarketing?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
