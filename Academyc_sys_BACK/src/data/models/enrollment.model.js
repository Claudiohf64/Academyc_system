module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    career_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    estado: { type: DataTypes.ENUM('activa', 'completada', 'anulada'), allowNull: false, defaultValue: 'activa' },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'enrollments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Enrollment.associate = function(models) {
    Enrollment.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    Enrollment.belongsTo(models.Career, { foreignKey: 'career_id', as: 'career' });
  };

  return Enrollment;
};
