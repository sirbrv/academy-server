const dbConfig = require("./config");
const { Sequelize, DataTypes } = require("sequelize");

let DB_DATABSE = dbConfig.database;
let DB_USER = dbConfig.user;
let DB_PASSWORD = dbConfig.password;
let DB_HOST = dbConfig.host;
let DB_PORT = dbConfig.port;

console.log(DB_PORT, DB_DATABSE, DB_USER, DB_HOST, DB_PASSWORD);

const sequelize = new Sequelize(DB_DATABSE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado a la base de datos MySQL");
  })
  .catch((err) => {
    console.log("Error de Conexión a la Base de Datos..", err);
  });

const db = {};
// db.Sequelize = Sequelize
db.sequelize = sequelize;
db.courses = require("../models/mysql/couses.js")(sequelize, DataTypes);
db.teachers = require("../models/mysql/teachers.js")(sequelize, DataTypes);
db.students = require("../models/mysql/students.js")(sequelize, DataTypes);
db.users = require("../models/mysql/users.js")(sequelize, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos Inicializada");
});

module.exports = db;
