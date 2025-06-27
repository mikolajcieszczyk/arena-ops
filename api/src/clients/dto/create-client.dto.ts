import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsDateString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export enum MembershipType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  VIP = 'vip',
  NONE = 'none',
}

export enum NTRPLevel {
  ONE_ZERO = '1.0',
  ONE_FIVE = '1.5',
  TWO_ZERO = '2.0',
  TWO_FIVE = '2.5',
  THREE_ZERO = '3.0',
  THREE_FIVE = '3.5',
  FOUR_ZERO = '4.0',
  FOUR_FIVE = '4.5',
  FIVE_ZERO = '5.0',
  FIVE_FIVE = '5.5',
  SIX_ZERO = '6.0',
  SEVEN_ZERO = '7.0',
}

export class CreateClientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsEnum(MembershipType)
  @IsOptional()
  membershipType?: MembershipType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(NTRPLevel)
  @IsOptional()
  skillLevel?: NTRPLevel;

  @IsBoolean()
  @IsOptional()
  acceptsMarketing?: boolean;
}
