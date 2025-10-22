import { Injectable } from '@nestjs/common';
import { NetworkingService } from '../../networking/networking.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRto } from '@common/rto/user.rto';

@Injectable()
export class AuthService {
  constructor(private readonly networkingService: NetworkingService) { }

  async register(registerDto: RegisterDto): Promise<UserRto> {
    return this.networkingService.send('auth.register', registerDto);
  }

  async login(loginDto: LoginDto) {
    return this.networkingService.send('auth.login', loginDto);
  }

  async getAllUsers(): Promise<UserRto[]> {
    return this.networkingService.send('auth.getAllUsers', {});
  }
}