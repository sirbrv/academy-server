const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../envirome/devEnvirome.env"),
});

const dbmonto_host = process.env.DB_MONGO_HOST;
const dbmongo_db = process.env.DB_DATABASE;

// const MONGODB_URL = `mongodb://${dbmonto_host}/${dbmongo_db}`;

const MONGODB_URL = process.env.DB_MONGO_URI;

mongoose
  .connect(MONGODB_URL, {})
  .then((bd) => console.log("Conexión exitosa a la BD de Mongoose"))
  .catch((err) => console.log("Error de Conexión db ", err));
