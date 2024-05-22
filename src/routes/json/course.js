const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourse,
  delCourse,
  AddCourse,
  upDateCourse,
} = require("../../controller/json/courses");

router.get("/courses", getCourses);
router.get("/course/:id", getCourse);
router.post("/course", AddCourse);
router.put("/course/:id", upDateCourse);
router.delete("/course/:id", delCourse);

module.exports = router;
