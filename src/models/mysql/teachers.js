module.exports = (sequelize, DataTypes) => {
  const Teachers = sequelize.define("teachers", {
    dni: { type: DataTypes.STRING(12), allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: true },
    adress: { type: DataTypes.TEXT, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    celular: { type: DataTypes.STRING(20), allowNull: true },
    condicion: { type: DataTypes.STRING(12), allowNull: true },
  });

  return Teachers;
};
