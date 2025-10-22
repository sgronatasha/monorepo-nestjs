import { registerAs } from '@nestjs/config';

export default registerAs('default', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/nestjs-monorepo',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
}));