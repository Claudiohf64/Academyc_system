const { DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      nombres: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "alumno", "docente"),
        allowNull: false,
        defaultValue: "alumno",
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  User.associate = function (models) {
    User.hasOne(models.Student, { foreignKey: "user_id", as: "student" });
    User.hasOne(models.Teacher, { foreignKey: "user_id", as: "teacher" });
  };

  return User;
};
