import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const MongooseConfig = MongooseModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/nest-auth',
    retryWrites: true,
    w: 'majority',
  }),
  inject: [ConfigService],
});