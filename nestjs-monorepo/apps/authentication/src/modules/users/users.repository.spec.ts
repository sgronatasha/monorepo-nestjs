import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from './users.repository';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let model: jest.Mocked<Model<User>>;

  const mockUser = {
    _id: 'mockUserId',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockModel = {
      new: jest.fn(),
      constructor: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      exec: jest.fn(),
      save: jest.fn(),
    };

    // Mock the model constructor
    Object.setPrototypeOf(mockModel, Model.prototype);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    model = module.get<Model<User>>(getModelToken(User.name)) as jest.Mocked<Model<User>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'plainPassword',
        firstName: 'Test',
        lastName: 'User',
      };

      const hashedPassword = 'hashedPassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const mockUserInstance = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      };

      // Create a constructor function that returns our mock instance
      const MockUserModel = jest.fn().mockImplementation(() => mockUserInstance);

      // Replace the model with our mock constructor
      repository['userModel'] = MockUserModel as any;

      // Act
      const result = await repository.create(createUserDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(MockUserModel).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [mockUser];
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(users),
      };
      model.find.mockReturnValue(mockQuery as any);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(model.find).toHaveBeenCalled();
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUser),
      };
      model.findOne.mockReturnValue(mockQuery as any);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };
      model.findOne.mockReturnValue(mockQuery as any);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      // Arrange
      const username = 'testuser';
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUser),
      };
      model.findOne.mockReturnValue(mockQuery as any);

      // Act
      const result = await repository.findByUsername(username);

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({ username });
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmailOrUsername', () => {
    it('should find user by email or username', async () => {
      // Arrange
      const identifier = 'testuser';
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockUser),
      };
      model.findOne.mockReturnValue(mockQuery as any);

      // Act
      const result = await repository.findByEmailOrUsername(identifier);

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({
        $or: [
          { email: identifier },
          { username: identifier },
        ],
      });
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});