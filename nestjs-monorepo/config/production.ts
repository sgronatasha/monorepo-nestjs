export const productionConfig = {
  database: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/your-production-db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-production-secret',
    expiresIn: '1h',
  },
  logging: {
    level: 'error',
  },
};