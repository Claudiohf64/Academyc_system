module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    career_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    creditos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
    dias: { type: DataTypes.STRING(100), allowNull: true },
    horario: { type: DataTypes.STRING(100), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: 'courses',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Course.associate = function(models) {
    Course.belongsTo(models.Career, { foreignKey: 'career_id', as: 'career' });
  };

  return Course;
};
