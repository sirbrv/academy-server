module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define("students", {
    dni: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: true },
    adress: { type: DataTypes.TEXT, allowNull: true },
    password: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    celular: { type: DataTypes.STRING, allowNull: true },
    condicion: { type: DataTypes.STRING, allowNull: true },
  });

  return Students;
};
