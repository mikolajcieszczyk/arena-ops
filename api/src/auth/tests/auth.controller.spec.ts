import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from '../../users/enums/user-role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn().mockResolvedValue({ accessToken: 'mockToken' }),
      userRepository: {},
      jwtService: {},
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CLIENT,
    };

    it('should call authService.register with correct parameters', async () => {
      const mockToken = { accessToken: 'mockToken' };

      const result = await controller.register(registerDto);

      const registerCall = mockAuthService.register.mock.calls[0][0];
      expect(registerCall).toEqual(registerDto);
      expect(result).toEqual(mockToken);
    });
  });
});
