const fs = require("fs").promises;
const matriculasFile = "src/json/";

//* *************************************************************** *//
//       definición de rutas  de acceso a archivo matriculas           //
//* *************************************************************** *//

const getMatriculas = async (req, res) => {
  try {
    const datos = await fs.readFile(matriculasFile, "utf-8");
    const matriculas = JSON.parse(datos);
    setTimeout(() => {
      res
        .send({ data: matriculas, message: "Consulta Exitosa", exito: true })
        .status(200);
    }, 10);
    return;
  } catch (error) {
    console.log("Este es el error....:", error);
  }
};

const getMatricula = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(matriculasFile, "utf-8");
    const matriculas = JSON.parse(datos);
    const matricula = matriculas.find((matricula) => matricula.id === id);
    return res
      .status(200)
      .json([{ data: matricula, message: "Consulta Exitosa", exito: true }]);
  } catch (error) {
    console.log("Error en consilta...", error);
  }
};

const getMatriculaCodigo = async (req, res) => {
  let codigo = parseInt(req.params.codigo);
  try {
    const datos = await fs.readFile(matriculasFile, "utf-8");
    const matriculas = JSON.parse(datos);
    const matricula = matriculas.find((matricula) => matricula.codigo == codigo);
    let messageResult = "";
    let status = false;
    if (matricula === undefined) {
      messageResult = "El Codigo ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ data: matricula, message: messageResult, exito: status });
  } catch (error) {
    console.log("Error en consulta...", error);
  }
};

const AddMatricula = async (req, res) => {
  console.log("Entre a addMatricula");
  console.log(req.body);
  let nuevoMatricula = {
    id: parseInt(req.body.id),
    curso: req.body.curso,
    profesor: req.body.profesor,
    student: req.body.student,
    turno: req.body.turno,
    finicio: req.body.finicio,
    ffin: req.body.ffin,
  };

  try {
    console.log("en el tray");
    const datos = await fs.readFile(matriculasFile, "utf-8");
    const matriculas = JSON.parse(datos);
    const matricula = matriculas.find((matricula) => matricula.codigo == req.body.codigo);
    console.log("en el tray....", matricula);
    // if (matricula) {
    //   return res.status(400).send({
    //     data: "",
    //     message: "El Número de documento ingresado, ya está registrado..",
    //     exito: false,
    //   });
    // }
    console.log("pase");
    let id = getNextId(matriculas);
    nuevoMatricula.id = id;
    matriculas.push(nuevoMatricula);
    await fs.writeFile(matriculasFile, JSON.stringify(matriculas));
    return res.status(201).send({
      data: nuevoMatricula,
      message: "Registro agregado con éxito",
      exito: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteMatricula = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(matriculasFile, "utf-8");
    const matriculas = JSON.parse(datos);
    const index = matriculas.findIndex((item) => item.id === id);
    if (index >= 0) {
      matriculas.splice(index, 1);
      await fs.writeFile(matriculasFile, JSON.stringify(matriculas));
    }
    return res.status(200).send({
      message: "Registro eliminado con éxito",
      exito: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateMatricula = async (req, res) => {
  console.log(req.body);
  let id = parseInt(req.params.id);
  let nuevoDato = {
    id: parseInt(req.body.id),
    curso: req.body.curso,
    profesor: req.body.profesor,
    student: req.body.student,
    turno: req.body.turno,
    finicio: req.body.finicio,
    ffin: req.body.ffin,
  };
  try {
    const datos = await fs.readFile(matriculasFile, "utf-8");
    const matriculas = JSON.parse(datos);
    console.log("Id....:", id);
    const index = matriculas.findIndex((item) => parseInt(item.id) == id);
    console.log("index...", index);
    if (index >= 0) {
      matriculas[index] = nuevoDato;
      await fs.writeFile(matriculasFile, JSON.stringify(matriculas));
    }
    console.log("matriculas.....", nuevoDato);
    return res
      .status(200)
      .json({ data: nuevoDato, message: "Registro Actualizado", exito: true });
  } catch (error) {
    console.log(error);
  }
};

//* *************************************************************** *//
//       se genera ID en funcion a los regisatro del archivo         //
//* *************************************************************** *//

function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  const maxId = Math.max(...data.map((item) => item.id));
  return maxId + 1;
}

module.exports = {
  getMatriculas,
  getMatricula,
  getMatriculaCodigo,
  AddMatricula,
  deleteMatricula,
  updateMatricula,
};
