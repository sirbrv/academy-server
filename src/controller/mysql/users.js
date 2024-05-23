const { Sequelize } = require("sequelize");
const db = require("../../config/configDB");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const { generarJWT, verifyJWT } = require("../../services/general");
const { enviarMail } = require("../../services/sendMail");
const Users = db.users;
//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getUsers = async (req, res) => {
  try {
    await Users.findAll().then((data) => {
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

const getUser = async (req, res) => {
  try {
    const existeItem = await Users.findOne({ where: { id: req.params.id } });
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

const getUserDni = async (req, res) => {
  try {
    const existeItem = await Users.findOne({
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
//       Sección de acceso por el Login de usuario    //
//**************************************************** */

const loginUser = async (req, res) => {
  const usuario = await Users.findOne({ where: { email: req.body.email } });
  if (!usuario) {
    return res.status(400).json({
      status: "400",
      message: "El email indicado no está registrado",
    });
  }
  const match = await bcrypt.compare(req.body.password, usuario.password);
  if (!match) {
    return res.status(400).json({
      status: "400",
      message: "La contraseña es incorrecta...",
    });
  } else {
    const token = generarJWT(usuario);
    const regNew = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      role: usuario.role,
      email: usuario.email,
      condicion: usuario.condicion,
      celular: usuario.celular,
      token: token,
      login: true,
    };
    res.cookie("jwtAcademy", token);
    res.status(200).json({
      status: "200",
      data: regNew,
    });
    // console.log(res);
    return;
  }
};
//**************************************************** */
//     Eliminación de registro por id en la BD          //
//**************************************************** */

const delUser = async (req, res) => {
  const existeItem = await Users.findByPk(req.params.id);
  if (!existeItem) {
    res.status(400).json({ message: "El ID indicado no está registrado" });
    return;
  }
  try {
    await Users.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Registro Eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddUser = async (req, res) => {
  const existeItem = await Users.findOne({
    where: { dni: req.body.dni },
  });
  if (existeItem) {
    return res
      .status(400)
      .json({ message: "El código indicado ya está registrado" });
  }
  let encritaClave = "";
  if (req.body.password) {
    encritaClave = await bcrypt.hash(req.body.password, 10);
  }
  const newUser = {
    dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    adress: req.body.adress,
    password: encritaClave,
    city: req.body.city,
    celular: req.body.numTelefono,
    role: req.body.role,
    condicion: req.body.status,
  };

  try {
    const registro = await Users.create(newUser);
    await enviarMail({
      email: newUser.email,
      subject: "Mensaje de Prueba",
      message: `Hola Este es un m,ensaje de prueba de envio de correo... `,
    });
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

const upDateUser = async (req, res) => {
  const id = parseInt(req.params.id);

  await Users.findOne({ where: { id: req.params.id } })
    .then((item) => {
      if (item) {
        let existeUser = {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          email: req.body.email,
          adress: req.body.adress,
          // password: req.body.password,
          city: req.body.city,
          celular: req.body.numTelefono,
          role: req.body.role,
          condicion: req.body.status,
        };
        const item_data = item.update(existeUser).then(function () {
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

const cambioClaveUser = async (req, res) => {
  // console.log("Entre. body...:", req.body);
  // console.log("Datos del token.....:", verifyJWT(req.body.token));
  let encriClave = await bcrypt.hash(req.body.newPassword, 10);
  // console.log("Encrita....:", encriClave);
  const usuario = await Users.findOne({
    where: { email: req.body.email },
  });
  // console.log("usuario..........:");
  if (!usuario) {
    return res
      .status(400)
      .json({ status: "400", message: "El Usuário, no está Registrado..." });
  } else {
    // console.log("pase a verificación.....:");
    const comp = await bcrypt.compare(req.body.oldPassword, usuario.password);
    if (!comp) {
      return res
        .status(400)
        .json({ status: "400", message: "Clave actual incorrecta..." });
    }
  }
  // console.log("Pase a grabar.....");
  await Users.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      let usuario = user;
      usuario = {
        password: encriClave,
      };

      user
        .update(usuario)
        .then(function () {
          res.status(200).json({
            status: "200",
            message: "Contraseña Actualizada Correctamente...",
          });
        })
        .catch((err) => {
          res.status(500).json({ status: "500", message: err.message });
        });
    }
  });
};

module.exports = {
  getUsers,
  getUser,
  delUser,
  AddUser,
  upDateUser,
  loginUser,
  cambioClaveUser,
  getUserDni,
};
