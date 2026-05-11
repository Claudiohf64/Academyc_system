module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, references: { model: 'users', key: 'id' } },
    dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
    nombres: { type: DataTypes.STRING(120), allowNull: false },
    apellido_paterno: { type: DataTypes.STRING(80), allowNull: false },
    apellido_materno: { type: DataTypes.STRING(80), allowNull: false },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    tableName: 'students',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Student.associate = function(models) {
    Student.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Student;
};