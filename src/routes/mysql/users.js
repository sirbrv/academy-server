const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  delUser,
  AddUser,
  upDateUser,
  loginUser,
  cambioClaveUser,
  getUserDni,
} = require("../../controller/mysql/users");
const { createUserImg, UserImg } = require("../../controller/mysql/images");
const { isAuthenticated, isAdmin } = require("../../middleware/auth");

const multer = require("multer");
const path = require("path");

const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/imagens/users"),

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".png");
  },
});

const fileUpload = multer({ storage: diskstorage }).single("avatar");

/** ***************************************** */
/* Rutas de acceso a la tabla de cursos       */
/** **************************************** */

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", AddUser);
router.post("/user/login", loginUser);
router.delete("/user/:id", delUser);
router.put("/user/cambio", isAuthenticated,isAdmin("isAdmin"), cambioClaveUser);
router.put("/user/:id", upDateUser);

/** ***************************************** */
/* Rutas de acceso a la tabla de imagenes    */
/** **************************************** */

// router.post("/image", fileUpload, UserImg);

module.exports = router;
