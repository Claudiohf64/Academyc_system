module.exports = (sequelize, DataTypes) => {
  const Career = sequelize.define('Career', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    duracion_meses: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 36 },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: 'careers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Career.associate = function(models) {
    Career.hasMany(models.Course, { foreignKey: 'career_id', as: 'courses' });
  };

  return Career;
};
