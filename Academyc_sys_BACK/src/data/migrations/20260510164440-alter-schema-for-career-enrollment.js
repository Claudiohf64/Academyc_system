'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const careersTable = await queryInterface.describeTable('careers');
      if (!careersTable.duracion_meses) {
        await queryInterface.addColumn('careers', 'duracion_meses', {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 36
        }, { transaction });
      }

      const coursesTable = await queryInterface.describeTable('courses');
      if (!coursesTable.fecha_inicio) {
        await queryInterface.addColumn('courses', 'fecha_inicio', { type: Sequelize.DATEONLY, allowNull: true }, { transaction });
      }
      if (!coursesTable.fecha_fin) {
        await queryInterface.addColumn('courses', 'fecha_fin', { type: Sequelize.DATEONLY, allowNull: true }, { transaction });
      }
      if (!coursesTable.dias) {
        await queryInterface.addColumn('courses', 'dias', { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      }
      if (!coursesTable.horario) {
        await queryInterface.addColumn('courses', 'horario', { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      }

      const enrollmentsTable = await queryInterface.describeTable('enrollments');
      
      try {
        await queryInterface.removeConstraint('enrollments', 'unique_student_course_enrollment', { transaction });
      } catch (e) {}

      if (enrollmentsTable.course_id) {
        await queryInterface.removeColumn('enrollments', 'course_id', { transaction });
      }

      if (!enrollmentsTable.career_id) {
        await queryInterface.addColumn('enrollments', 'career_id', {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'careers',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }, { transaction });
      }

      try {
        await queryInterface.addConstraint('enrollments', {
          fields: ['student_id', 'career_id'],
          type: 'unique',
          name: 'unique_student_career_enrollment',
          transaction
        });
      } catch (e) {}

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
  }
};
