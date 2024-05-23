const Sequelize = require("sequelize");
const db = require("../../config/configDB");
const CoursesImgs = db.coursesImgs;

/*********************** Seccion de manejo de CoursesImgs  ***************** */

exports.getCourseImgs = async (req, res) => {
  let page = req.query.page ? req.query.page - 1 : 0;
  page = page < 0 ? 0 : page;
  let limit = parseInt(req.query.limit || 10);
  limit = limit < 0 ? 10 : limit;
  const offset = page * limit;

  CoursesImgs.findAndCountAll({
    where: {
      name: { [Op.like]: `%${req.query.sch}%` },
    },
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.ststus(200).json({
        status: "200",
        message: "Información Registrada...",
        CoursesImgs: response,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "No hay Información Registrada..",
      });
    });
};

const CourseImg = async (req, res) => {
  let filePath = "";
  if (req.file) {
    filePath = `/imagens/Courses/${req.file.filename}`;
  }
  res.send({
    status: "200",
    message: `Imagen agregada..`,
    urlImage: filePath,
  });
};

const createCourseImg = async (req, res) => {
  const filename = req.file.filename;
  const existeCourse = await CoursesImgs.findOne({
    where: {
      [Op.and]: [
        { codCourse: req.body.codCourse },
        { name: req.file.filename },
      ],
    },
  });

  if (existeCourse) {
    return res.ststus(400).json({
      status: "403",
      message: "La imagen ya fué Ingresáda",
    });
  }
  let filePath = null;
  if (req.file) {
    filePath = `/imagens/Courses/${filename}`;
    if (existeCourse) {
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error eliminando file" });
        }
      });
      return res.status(400).json({ message: "La imagen ya existe" });
    }
  }

  const fileUrl = filePath;
  const newItem = {
    codCourse: req.body.codCourse,
    name: filename,
    url: fileUrl,
  };
  try {
    await CoursesImgs.create(newItem);
    res.ststus(200).json({
      status: "200",
      message: `Imagen agregada..`,
      CourseImg: newItem,
    });
  } catch (error) {
    res.ststus(400).json({ status: "409", message: error.message });
  }
};

exports.getCourseImg = async (req, res) => {
  const existeCourse = await CoursesImgs.findOne({
    where: { id: req.params.id },
  });
  if (!existeCourse) {
    return res
      .ststus(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  res.ststus(200).json({ status: "200", Courses: existeCourse });
};

exports.getCourseImages = async (req, res) => {
  const existeCourse = await CoursesImgs.findAll({
    where: { codCourse: req.params.id },
  });
  if (!existeCourse) {
    return res
      .ststus(200)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  res.ststus(200).json({ status: "200", CourseImgs: existeCourse });
};

exports.updateCourseImg = async (req, res, next) => {
  await CoursesImgs.findOne({ where: { id: req.params.id } }).then((item) => {
    if (item) {
      let existeCourse = {
        description: req.body.description,
        place: req.body.place,
        type: req.body.type,
      };
      const item_data = item
        .update(existeCourse)
        .then(function () {
          res.ststus(200).json({
            status: "200",
            CourseImg: item_data,
            message: "Registro de Imagen, Actualizado",
          });
        })
        .catch((err) => {
          // console.log(err);
          res.ststus(500).json({ status: "500", message: err.message });
        });
    }
  });
};

exports.deleteCourseImg = async (req, res, next) => {
  const existeCourse = await CoursesImgs.findOne({
    where: { id: req.params.id },
  });

  if (!existeCourse) {
    return res
      .ststus(400)
      .json({ status: "403", message: "El ID no está registrado" });
  }
  try {
    await CoursesImgs.destroy({ where: { id: req.params.id } });
    const data = CoursesImgs.findAll({
      where: { codCourse: existeCourse.codCourse },
    });
    return res.ststus(200).json({
      status: "200",
      CourseImg: data,
      message: "Imagen Eliminada.",
    });
  } catch (error) {
    res.ststus(400).json({ status: "400", message: error });
  }
};

module.exports = {
  createCourseImg,
  CourseImg,
};
