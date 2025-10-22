export const developmentConfig = {
  database: {
    uri: 'mongodb://localhost:27017/nestjs-monorepo-dev',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  microservice: {
    transport: 'tcp',
    options: {
      host: 'localhost',
      port: 3001,
    },
  },
  jwt: {
    secret: 'your_jwt_secret',
    expiresIn: '1h',
  },
};