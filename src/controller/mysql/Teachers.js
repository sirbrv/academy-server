const { Sequelize } = require("sequelize");
const db = require("../../config/configDB");
const Teachers = db.teachers;

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getTeachers = async (req, res) => {
  try {
    await Teachers.findAll().then((data) => {
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

const getTeacher = async (req, res) => {
  try {
    const existeItem = await Teachers.findOne({ where: { id: req.params.id } });
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

const getTeacherDni= async (req, res) => {
  try {
    const existeItem = await Teachers.findOne({
      where: { dni: req.params.dni },
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

const delTeacher = async (req, res) => {
  const existeItem = await Teachers.findByPk(req.params.id);
  if (!existeItem) {
    res.status(400).json({ message: "El ID indicado no está registrado" });
    return;
  }
  try {
    await Teachers.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Registro Eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddTeacher = async (req, res) => {
  const existeItem = await Teachers.findOne({
    where: { dni: req.body.dni },
  });
  if (existeItem) {
    return res
      .status(400)
      .json({ message: "El código indicado ya está registrado" });
  }
  const newTeacher = {
    // dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    adress: req.body.adress,
    password: req.body.password,
    city: req.body.city,
    celular: req.body.celular,
    role: req.body.role,
    condicion: req.body.condicion,
  };

  try {
    const registro = await Teachers.create(newTeacher);
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

const upDateTeacher = async (req, res) => {
  const id = parseInt(req.params.id);

  await Teachers.findOne({ where: { id: req.params.id } })
    .then((item) => {
      if (item) {
        let existeTeacher = {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          email: req.body.email,
          adress: req.body.adress,
          // password: req.body.password,
          city: req.body.city,
          celular: req.body.celular,
          role: req.body.role,
          condicion: req.body.condicion,
        };
        const item_data = item.update(existeTeacher).then(function () {
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
  getTeachers,
  getTeacher,
  delTeacher,
  AddTeacher,
  upDateTeacher,
  getTeacherDni,
};
