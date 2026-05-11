'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`UPDATE users SET role = 'admin' WHERE role = 'user'`);
    await queryInterface.sequelize.query(`ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'alumno', 'docente', 'user') NOT NULL DEFAULT 'alumno'`);

    try {
      await queryInterface.sequelize.query(`ALTER TABLE users DROP PRIMARY KEY`);
    } catch(e) {}
    await queryInterface.sequelize.query(`ALTER TABLE users MODIFY id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY`);

    await queryInterface.addColumn('students', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('teachers', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('teachers', 'user_id');
    await queryInterface.removeColumn('students', 'user_id');
    
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    });
  }
};
