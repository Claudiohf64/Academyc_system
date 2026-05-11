const { Sequelize } = require('sequelize');
const env = require('./env');

module.exports = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true
  }
});