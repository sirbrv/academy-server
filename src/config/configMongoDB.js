const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../envirome/devEnvirome.env"),
});
const dbmonto_host = process.env.DB_MONGO_HOST;
const dbmongo_db = process.env.DB_DATABASE;
mongodb://u8empum37mchnqfxr2ht:y8npPKqnHdvPE25kd30@bjhy9zia87hifh9f6bfc-mongodb.services.clever-cloud.com:2109/bjhy9zia87hifh9f6bfc
const MONGODB_URL = `mongodb://${dbmonto_host}/${dbmongo_db}`;

mongoose
  .connect(MONGODB_URL, {})
  .then((bd) => console.log("Conexión exitosa a la BD de Mongoose"))
  .catch((err) => console.log("Error de Conexión db ", err));
