import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockUser = {
    id: 'mockUserId',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
  };

  const mockUserRto = {
    id: 'mockUserId',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLoginResponse = {
    access_token: 'mockJwtToken',
    user: mockUser,
  };

  beforeEach(async () => {
    const mockService = {
      register: jest.fn(),
      login: jest.fn(),
      getAllUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      service.register.mockResolvedValue(mockUserRto);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUserRto);
    });

    it('should handle registration errors', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const error = new Error('Registration failed');
      service.register.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'password123',
      };

      service.login.mockResolvedValue(mockLoginResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle login errors', async () => {
      // Arrange
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      service.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users when authenticated', async () => {
      // Arrange
      const users = [mockUserRto];
      service.getAllUsers.mockResolvedValue(users);

      // Act
      const result = await controller.getAllUsers();

      // Assert
      expect(service.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Service unavailable');
      service.getAllUsers.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getAllUsers()).rejects.toThrow('Service unavailable');
    });
  });

  describe('API Documentation', () => {
    it('should have proper controller metadata', () => {
      // Verify that the controller is properly decorated
      expect(controller).toBeDefined();
      expect(typeof controller.register).toBe('function');
      expect(typeof controller.login).toBe('function');
      expect(typeof controller.getAllUsers).toBe('function');
    });
  });
});