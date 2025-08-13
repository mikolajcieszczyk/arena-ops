import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password_hash: string;

  @Column()
  @IsNotEmpty()
  first_name: string;

  @Column()
  @IsNotEmpty()
  last_name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, unknown>;

  @Column({ nullable: true })
  last_login?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  async setPassword(password: string): Promise<void> {
    this.password_hash = await bcrypt.hash(password, 10);
  }

  toResponse(): Omit<
    User,
    'password_hash' | 'validatePassword' | 'setPassword' | 'toResponse'
  > {
    const { password_hash, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
