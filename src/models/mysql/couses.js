module.exports = (sequelize, DataTypes) => {
  const Couses = sequelize.define("couses", {
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    costo: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    condicion: { type: DataTypes.STRING(15), allowNull: true },
    duracion: { type: DataTypes.INTEGER, allowNull: true },
    clasificacion: { type: DataTypes.INTEGER, allowNull: true },
    profesores: { type: DataTypes.JSON, allowNull: true },
    urlImagen: { type: DataTypes.STRING(100), allowNull: true },
  });

  return Couses;
};
