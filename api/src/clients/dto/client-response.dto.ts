import { MembershipType, NTRPLevel } from './create-client.dto';

export class ClientResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  city?: string;
  membershipType?: MembershipType;
  isActive?: boolean;
  emergencyContact?: string;
  notes?: string;
  skillLevel?: NTRPLevel;
  acceptsMarketing?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
