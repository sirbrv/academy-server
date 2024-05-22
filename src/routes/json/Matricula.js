const express = require("express");
const router = express.Router();
const {
  getMatriculas,
  getMatricula,
  getMatriculaCodigo,
  AddMatricula,
  deleteMatricula,
  updateMatricula,
} = require("../../controller/json/matriculas");

/* *******************************************************  */
/*             Ruta de acceso a archivos Matriculas           */
/* *******************************************************  */

router.get("/matriculas", getMatriculas);
router.get("/matricula/:id", getMatricula);
router.get("/matricula/:codigo", getMatriculaCodigo);
router.post("/matricula", validarData, AddMatricula);
router.put("/matricula/:id", validarData, updateMatricula);
router.delete("/matricula/:id", deleteMatricula);
function validarData(req, res, next) {
  // console.log("Body....", req.body);
  const { codigo, nombre, descripcion } = req.body;

  // if (!codigo) {
  //   return res.status(400).json({
  //     message: "Ingrese un codigo válido..",
  //     exito: false,
  //   });
  // }
  // if (!nombre) {
  //   return res.status(400).json({
  //     message: "El nombre, del Estudiante está vacío..",
  //     exito: false,
  //   });
  // }
  next();
}

module.exports = router;
