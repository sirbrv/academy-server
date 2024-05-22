const fs = require("fs").promises;
const coursesFile = "src/json/courses.json";

//**************************************************** */
//     Busca de datos generales del archivo json        //
//**************************************************** */

const getCourses = async (req, res) => {
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    res.send({ data: courses, message: "Consulta exitosa" }).status(200);
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//     Busca de registro por id archivo json           //
//**************************************************** */

const getCourse = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const course = courses.find((item) => item.id === id);
    if (course) {
      res.send({ data: course, message: "Consulta exitosa" }).status(200);
    } else {
      res.send({ message: "El registro indicado no existe" }).status(400);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//     Eliminación de registro por id archivo json     //
//**************************************************** */

const delCourse = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const index = courses.findIndex((item) => item.id === id);
    if (index >= 0) {
      courses.splice(index, 1);
      await fs.writeFile(coursesFile, JSON.stringify(courses));
      res.send({ message: "Registro Eliminado exitosamente" }).status(200);
    } else {
      res.send({ message: "El registro indicado no existe" }).status(400);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//          Se crea registro en archivo json           //
//**************************************************** */

const AddCourse = async (req, res) => {
  console.log("Registro entrante.....:", req.body);
  const newCourse = {
    // id: parseInt(req.body.id),
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    costo: req.body.costo,
    estatus: req.body.estatus,
  };

  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const course = courses.find((item) => item.codigo === req.body.codigo);
    console.log("Reg. encontrado....:", course);
    if (course) {
      return res.status(400).send({ message: "El curso ingresado ya existe" });
    }
    newCourse.id = getNextId(courses);
    courses.push(newCourse);
    await fs.writeFile(coursesFile, JSON.stringify(courses));
    res.send({ data: newCourse, message: "Registro creado" }).status(201);
    return;
  } catch (error) {
    console.log(error);
  }
};

//**************************************************** */
//          Se actualiza registro en archivo json           //
//**************************************************** */

const upDateCourse = async (req, res) => {
  console.log("Registro entrante.....:", req.body);
  const id = parseInt(req.params.id);
  const newCourse = {
    id: parseInt(req.body.id),
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    costo: req.body.costo,
    estatus: req.body.estatus,
  };
  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const index = courses.findIndex((item) => item.id === id);
    if (index >= 0) {
      courses[index] = newCourse;
      await fs.writeFile(coursesFile, JSON.stringify(courses));

      res.send({ message: "Registro Actualiza" }).status(200);
    } else {
      res.send({ message: "El registro indicado no existe" }).status(400);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

function getNextId(data) {
  if (data.length === 0) {
    return 1;
  }
  const maxId = Math.max(...data.map((item) => item.id));
  console.log("maxId.....", maxId);
  return maxId + 1;
}

module.exports = {
  getCourses,
  getCourse,
  delCourse,
  AddCourse,
  upDateCourse,
};
