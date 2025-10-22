import { Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserRto } from './rtos/user.rto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @MessagePattern('auth.getAllUsers')
  async findAll(): Promise<UserRto[]> {
    const users = await this.usersService.getAllUsers();
    return users.map(user => new UserRto(user));
  }

  @MessagePattern('auth.register')
  async create(@Payload() createUserDto: CreateUserDto): Promise<UserRto> {
    const user = await this.usersService.create(createUserDto);
    return new UserRto(user);
  }

  @MessagePattern('auth.login')
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}