import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { NetworkingService } from './networking/networking.service';
import { HealthController } from './health.controller';

@Module({
  imports: [AuthModule],
  controllers: [HealthController],
  providers: [NetworkingService],
})
export class AppModule { }