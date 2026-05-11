'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true },
      dni: { type: Sequelize.STRING(8), allowNull: false, unique: true },
      nombres: { type: Sequelize.STRING(120), allowNull: false },
      apellido_paterno: { type: Sequelize.STRING(80), allowNull: false },
      apellido_materno: { type: Sequelize.STRING(80), allowNull: false },
      telefono: { type: Sequelize.STRING(20), allowNull: true },
      direccion: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('students');
  }
};