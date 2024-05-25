const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 5000;
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
/* ******************************************** */
/*   **** Sección de config. de DB              */
/* ******************************************** */
require("./config/configMongoDB.js");

/* ******************************************** */
/*   **** Sección de Middleware                 */
/* ******************************************** */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://incredible-brioche-9fa76b.netlify.app",
    ],
    credentials: true,
  })
);
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));
app.use("/imagens", express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "/public")));

/* ******************************************** */
/*   **** Sección de Rutas                      */
/* ******************************************** */
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/html/welcome.html");
});

app.use("/api", require("./routes/json/contact.js"));
app.use("/api", require("./routes/json/course.js"));
app.use("/api", require("./routes/json/Student.js"));
app.use("/api", require("./routes/json/Teacher.js"));
app.use("/api", require("./routes/json/Matricula.js"));

// /* ************ acceso a las rutas de BD mysql ***********/
app.use("/api/v2", require("./routes/mysql/course.js"));
app.use("/api/v2", require("./routes/mysql/teacher.js"));
app.use("/api/v2", require("./routes/mysql/users"));
// app.use("/api/v2", require("./routes/mysql/Student.js"));
// app.use("/api/v2", require("./routes/mysql/Matricula.js"));
///
// /* ************ acceso a las rutas de BD MongoDB ***********/
app.use("/api/v3", require("./routes/mongodb/users"));
app.use("/api/v3", require("./routes/mongodb/course.js"));
app.use("/api/v3", require("./routes/mongodb/teacher.js"));
app.use("/api/v3", require("./routes/mongodb/Student.js"));
app.use("/api/v3", require("./routes/mongodb/Matricula.js"));
//
// app.use("*", (req, res) => {
//   console.log("Request Type:", req.method);
//   console.log("Request URL:", req.originalUrl);
// });

app.use((red, res, next) => {
  res.status(404).sendFile(__dirname + "/public/html/404.html");
});

app.get("/imagens/:img", function (req, res) {
  res.sendFile(`imagens/${img}`);
});

// app.use("*", (req, res) => {
//   console.log("Request Type:", req.method);
//   console.log("Request URL:", req.originalUrl);
// });

app.listen(port, () => {
  /// console.log("Servidor disponible en  http://localhost:" + port);
  console.log("Servidor disponible en puerto ..:" + port);
});
