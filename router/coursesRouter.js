const express = require("express");
const router = express.Router();

const createCourses = require("../controllers/courses/createCourses");
const getCourses = require("../controllers/courses/getCourses");
const getCourseById = require("../controllers/courses/getCourseById");
const updateCourse = require("../controllers/courses/updateCourse");
const geMyCourses = require("../controllers/courses/getMyCourses");
const getCourseStudents = require("../controllers/courses/getCourseStudents");
const deleteCourse = require("../controllers/courses/deleteCourse");
const { checkAuth } = require("../middleware/checkAuth");
const { checkRole } = require("../middleware/checkRole");
const { isCourseOwner } = require("../middleware/isCourseOwner");

router.get("/", getCourses);
router.get("/course/:id", getCourseById);

router.use(checkAuth);
router.use( checkRole(["admin", "instructor"]) );
router.post("/create-courses", createCourses);
router.get("/my-courses", isCourseOwner, geMyCourses);
router.put("/updateCourse/:courseId", isCourseOwner, updateCourse);
router.delete("/deleteCourse/:id", isCourseOwner, deleteCourse);
router.get('/:courseId/students', isCourseOwner, getCourseStudents)

module.exports = router;
