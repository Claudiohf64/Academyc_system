const env = require('./env');

const baseConfig = {
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql'
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig
};