module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, references: { model: 'users', key: 'id' } },
    cod_docente: { type: DataTypes.STRING(8), allowNull: false, unique: true },
    dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
    nombres: { type: DataTypes.STRING(120), allowNull: false },
    apellido_paterno: { type: DataTypes.STRING(80), allowNull: false },
    apellido_materno: { type: DataTypes.STRING(80), allowNull: false },
    celular: { type: DataTypes.STRING(20), allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    tableName: 'teachers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Teacher.associate = function(models) {
    Teacher.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Teacher;
};