import { Injectable } from '@nestjs/common';
import { UserRto } from '@common/rto/user.rto';
import { RegisterDto } from './modules/auth/dto/register.dto';

@Injectable()
export class AppService {
  async registerUser(registerDto: RegisterDto): Promise<UserRto> {
    return {} as UserRto;
  }

  async getAllUsers(): Promise<UserRto[]> {
    return [];
  }
}