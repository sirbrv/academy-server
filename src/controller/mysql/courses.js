const { Sequelize } = require("sequelize");
const db = require("../../config/configDB");
const Courses = db.courses;
const courseController = require("../../controller/mysql/images");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getCourses = async (req, res) => {
  try {
    await Courses.findAll().then((data) => {
      res.status(200).json({ data: data, message: "Consulta exitosa" });
      return;
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //
//**************************************************** */

const getCourse = async (req, res) => {
  try {
    const existeItem = await Courses.findOne({ where: { id: req.params.id } });
    if (existeItem) {
      res.status(200).json({ data: existeItem, message: "Consulta exitosa" });
      return;
    }
    if (!existeItem) {
      res.status(400).json({ message: "El ID indicado no está registrado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//**************************************************** */
//  Busca de registro por código en la  base de datos  //
//**************************************************** */

const getCourseCodigo = async (req, res) => {
  try {
    const existeItem = await Courses.findOne({
      where: { codigo: req.params.codigo },
    });
    if (existeItem) {
      res.status(200).json({ data: existeItem, message: "Consulta exitosa" });
      return;
    }
    if (!existeItem) {
      res.status(400).json({ message: "El ID indicado no está registrado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Eliminación de registro por id en la BD          //
//**************************************************** */

const delCourse = async (req, res) => {
  const existeItem = await Courses.findByPk(req.params.id);
  if (!existeItem) {
    res.status(400).json({ message: "El ID indicado no está registrado" });
    return;
  }
  try {
    await Courses.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Registro Eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddCourse = async (req, res) => {
  const existeItem = await Courses.findOne({
    where: { codigo: req.body.codigo },
  });
  if (existeItem) {
    return res
      .status(400)
      .json({ message: "El código indicado ya está registrado" });
  }
  const newCourse = {
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    costo: req.body.costo,
    condicion: req.body.condicion,
    duracion: req.body.duracion,
    clasificacion: req.body.clasificacion,
    profesores: req.body.profesores,
    urlImagen: req.body.urlImage,
  };

  try {
    const registro = await Courses.create(newCourse);
    // const ressult = courseController(req, res);
    res.status(201).json({
      status: "201",
      data: registro,
      message: "El registro fué creado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se actualiza registro en archivo json           //
//**************************************************** */

const upDateCourse = async (req, res) => {
  const id = parseInt(req.params.id);

  await Courses.findOne({ where: { id: req.params.id } })
    .then((item) => {
      if (item) {
        let existeCourse = {
          codigo: req.body.codigo,
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          costo: req.body.costo,
          condicion: req.body.condicion,
          duracion: req.body.duracion,
          clasificacion: req.body.clasificacion,
          profesores: req.body.profesores,
          urlImagen: req.body.urlImage,
        };
        const item_data = item.update(existeCourse).then(function () {
          res.json({
            data: item_data,
            message: "El registro fué Actualizado",
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

module.exports = {
  getCourses,
  getCourse,
  delCourse,
  AddCourse,
  upDateCourse,
  getCourseCodigo,
};

