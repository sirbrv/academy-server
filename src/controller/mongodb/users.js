// const bcrypt = require("bcrypt");
const { generarJWT, verifyJWT } = require("../../services/general");
const { enviarMail } = require("../../services/sendMail");
const Users = require("../../models/mongodb/users");
const Teacher = require("../../models/mongodb/teachers");
const bcrypt = require("bcryptjs");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getUsers = async (req, res) => {
  try {
    await Users.find().then((data) => {
      res.status(200).json({ data: data, message: "Consulta exitosa" });
      return;
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //Compass
//**************************************************** */

const getUser = async (req, res) => {
  try {
    const existeItem = await Users.findOne({ id: req.params.id });
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
    const existeItem = await Users.findOne({ dni: req.params.dni });
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

const delUser = async (req, res) => {
  const existeItem = await Users.findByIdAndDelete(req.params.id);
  if (!existeItem) {
    res.status(400).json({ message: "El ID indicado no está registrado" });
    return;
  }
  try {
    // await Users.destroy({ where: { id: req.params.id } });
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
  // let encritaClave = "";
  // if (req.body.password) {
  //   // encritaClave = await bcrypt.hash(req.body.password, 10);
  //   encritaClave = await Users.encryptPassword(req.body.password);
  // }
  // console.log("Clave encriptada.....:", encritaClave);
  const user = new Users({
    dni: req.body.dni,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    adress: req.body.adress,
    // password: req.body.password,
    city: req.body.city,
    celular: req.body.numTelefono,
    role: req.body.role,
    condicion: req.body.status,
  });
  user.password = await user.encryptPassword(req.body.password);

  try {
    const registro = await user.save();
    await enviarMail({
      email: user.email,
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
  const id = req.params.id;
  try {
    const item_data = await Users.findByIdAndUpdate(
      id,
      {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        adress: req.body.adress,
        city: req.body.city,
        celular: req.body.numTelefono,
        role: req.body.role,
        condicion: req.body.status,
      },
      {
        nedw: true,
      }
    );
    res.json({
      data: item_data,
      message: "El registro fué Actualizado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//       Sección de acceso por el Login de usuario    //
//**************************************************** */

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const usuario = await Users.findOne({ email });
  if (!usuario) {
    return res.status(400).json({
      data: {
        status: "400",
        message: "El email indicado no está registrado",
      },
    });
  }
  const match = await usuario.matchPassword(password, usuario.password);
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

const loginTecher = async (req, res, next) => {
  const { email, password } = req.body;
  const usuario = await Teacher.findOne({ email });
  if (!usuario) {
    next();
  }
  const match = await usuario.matchPassword(password);

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

const cambioClaveUser = async (req, res) => {
  // console.log("Entre. body...:", req.body);
  // console.log("Datos del token.....:", verifyJWT(req.body.token));
  let user = new Users();
  let encriClave = await user.encryptPassword(req.body.newPassword, 10);
  const usuario = await Users.findOne({ email: req.body.email });
  // console.log("usuario..........:", usuario);
  if (!usuario) {
    return res
      .status(400)
      .json({ status: "400", message: "El Usuário, no está Registrado..." });
  } else {
    const comp = await usuario.matchPassword(
      req.body.oldPassword,
      usuario.password
    );
    if (!comp) {
      return res
        .status(400)
        .json({ status: "400", message: "Clave actual incorrecta..." });
    }
    try {
      let encriClave = await user.encryptPassword(req.body.newPassword, 10);
      const item_data = await Users.findByIdAndUpdate(usuario._id, {
        password: encriClave,
      });
      res.status(200).json({
        status: "200",
        message: "Contraseña Actualizada Correctamente...",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
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
  loginTecher,
};
