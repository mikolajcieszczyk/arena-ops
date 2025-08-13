import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserRole } from '../dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
    };

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
    const registerDto = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CLIENT,
    };

    it('should call authService.register with correct parameters', async () => {
      const mockToken = { accessToken: 'mockToken' };
      mockAuthService.register.mockResolvedValue(mockToken);

      const result = await controller.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockToken);
    });
  });
});
