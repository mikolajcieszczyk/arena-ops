import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });

      // Save user
      await this.userRepository.save(user);

      // Generate JWT token
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new InternalServerErrorException('Error during registration');
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      // Update last login timestamp
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date(),
      });

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new InternalServerErrorException('Error during login');
    }
  }
}
