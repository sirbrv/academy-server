module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    dni: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: true },
    email: { type: DataTypes.STRING(50), allowNull: false },
    adress: { type: DataTypes.TEXT, allowNull: true },
    password: { type: DataTypes.STRING(100), allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    celular: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING(12), allowNull: false },
    condicion: { type: DataTypes.STRING, allowNull: true },
  });

  return Users;
};
