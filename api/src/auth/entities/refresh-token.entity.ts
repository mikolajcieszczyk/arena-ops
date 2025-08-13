import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column({ nullable: true })
  deviceInfo: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;

  @Column({ nullable: true })
  revokedAt: Date;

  @Column({ nullable: true })
  revokedByIp: string;

  @Column()
  createdByIp: string;

  @Column({ nullable: true })
  replacedByToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<RefreshToken>) {
    Object.assign(this, partial);
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  isActive(): boolean {
    return !this.revoked && !this.isExpired();
  }
}
