const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourse,
  delCourse,
  AddCourse,
  upDateCourse,
  getCourseCodigo,
} = require("../../controller/mysql/courses");
const { createCourseImg, CourseImg } = require("../../controller/mysql/images");
// const { upload } = require("../../services/multer");
const multer = require("multer");
const path = require("path");

console.log("Estoy aqui...en mullter.");
const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/imagens/courses"),

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".png");
  },
});

const fileUpload = multer({ storage: diskstorage }).single("imageCourse");

/** ***************************************** */
/* Rutas de acceso a la tabla de cursos       */
/** **************************************** */

router.get("/courses", getCourses);
router.get("/course/:id", getCourse);
// router.get("/course/:codigo", getCourseCodigo);
// router.post("/course", AddCourse);
router.delete("/course/:id", delCourse);
router.put("/course/:id", fileUpload, upDateCourse);
router.post("/course", fileUpload, AddCourse);

// router.put("/course/:id", (req, res) => {
//   console.log("Archivo recibido:", req.file);
//   console.log("Archivo recibido:", req.body);
// });

/** ***************************************** */
/* Rutas de acceso a la tabla de imagenes    */
/** **************************************** */

router.post("/image", fileUpload, CourseImg);
// router.get("/image/:id", courseController.getCourseImages);
// router.put("/image/:id", courseController.updateCourseimage);
// router.delete("/image/:id", courseController.deleteCourseImg);

module.exports = router;
