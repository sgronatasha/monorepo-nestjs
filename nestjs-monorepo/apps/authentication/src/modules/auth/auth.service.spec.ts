import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from '../users/dtos/login.dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: 'mockUserId',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    toObject: jest.fn().mockReturnValue({
      _id: 'mockUserId',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
    }),
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findByEmailOrUsername: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      // Arrange
      const identifier = 'testuser';
      const password = 'plainPassword';

      usersRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.validateUser(identifier, password);

      // Assert
      expect(usersRepository.findByEmailOrUsername).toHaveBeenCalledWith(identifier);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        _id: 'mockUserId',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user is not found', async () => {
      // Arrange
      const identifier = 'nonexistent';
      const password = 'password';

      usersRepository.findByEmailOrUsername.mockResolvedValue(null);

      // Act
      const result = await service.validateUser(identifier, password);

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      // Arrange
      const identifier = 'testuser';
      const password = 'wrongPassword';

      usersRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await service.validateUser(identifier, password);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data when credentials are valid', async () => {
      // Arrange
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'plainPassword',
      };

      const expectedToken = 'mockJwtToken';

      usersRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: 'mockUserId',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user',
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'mockUserId',
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Arrange
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'wrongPassword',
      };

      usersRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      const loginDto: LoginDto = {
        identifier: 'nonexistent',
        password: 'password',
      };

      usersRepository.findByEmailOrUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});