const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  app: {
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'academic_system',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  dniApi: {
    baseUrl: process.env.DNI_API_BASE_URL || 'https://api.decolecta.com',
    token: process.env.DNI_API_TOKEN || '',
    timeout: Number(process.env.DNI_API_TIMEOUT || 10000)
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cambiar_para_produccion_ojo',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Administrador',
    email: process.env.ADMIN_EMAIL || 'admin@test.com',
    password: process.env.ADMIN_PASSWORD || '123456'
  }
};