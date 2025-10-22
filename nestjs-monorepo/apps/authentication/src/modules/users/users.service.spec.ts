import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../../schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser: User = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isActive: true,
    refreshTokens: [],
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findByEmailOrUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'plainPassword',
        firstName: 'Test',
        lastName: 'User',
      };

      repository.create.mockResolvedValue(mockUser);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should handle repository errors', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'plainPassword',
        firstName: 'Test',
        lastName: 'User',
      };

      const error = new Error('Database error');
      repository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [mockUser, { ...mockUser, username: 'user2', email: 'user2@example.com' }];
      repository.findAll.mockResolvedValue(users);

      // Act
      const result = await service.getAllUsers();

      // Assert
      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      repository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.getAllUsers();

      // Assert
      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      repository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getAllUsers()).rejects.toThrow('Database connection failed');
    });
  });
});