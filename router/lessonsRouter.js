const express = require('express')
const router = express.Router()

const addLessons=require('../controllers/lessons/addLessons')
const getLessonsByCourse=require('../controllers/lessons/getLessonsByCourse')
const getLessonById=require("../controllers/lessons/getLessonById")
const updateLessons=require('../controllers/lessons/updateLessons')
const deleteLesson=require('../controllers/lessons/deleteLesson')
const { checkAuth } = require('../middleware/checkAuth')
const { checkRole } = require('../middleware/checkRole')
const { isCourseOwner } = require('../middleware/isCourseOwner')
const { isEnrolled } = require('../middleware/isEnrolled')

router.use(checkAuth)

router.get("/course/:courseId/lessons",isEnrolled, getLessonsByCourse);
router.get("/lessons/:id",isEnrolled, getLessonById);


router.use(checkRole(['Admin','instructor']))
router.post("/course/:courseId/addLessons", addLessons);
router.put("/updateLessons/:lessonId", updateLessons);
router.delete("/deleteLesson/:lessonId", deleteLesson);


module.exports=router