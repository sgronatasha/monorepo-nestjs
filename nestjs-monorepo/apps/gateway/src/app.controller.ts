import { Controller, Post, Get, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './modules/auth/dto/register.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.appService.registerUser(registerDto);
  }

  @Get('users')
  async getAllUsers() {
    return this.appService.getAllUsers();
  }
}