const { enrollmentModel } = require("../models/enrollment");
const { coursesModel } = require("../models/tracks/courses");
const { lessonsModel } = require("../models/tracks/lessons");

const isEnrolled = async (req, res, next) => {
  try {
    let courseId;
    
    if (req.params.courseId) {

      courseId = req.params.courseId;

    } 
    else if (req.params.id) {

      const lesson = await lessonsModel
        .findById(req.params.id)
        .select("courseId");

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found",
        });
      }

      courseId = lesson.courseId;
    console.log("Course ID from lesson:", courseId);
    }

    const course = await coursesModel
      .findById(courseId)
      .select("instructorId");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role === "admin") {
      req.course = course;
      return next();
    }


    if (course.instructorId.toString() === req.user.id) {
      req.course = course;
      return next();
    }


    const enrolled = await enrollmentModel.findOne({
      course_id: courseId,
      student_id: req.user.id,
    });

    if (!enrolled) {
      return res.status(403).json({ message: "Not enrolled" });
    }

    req.course = course;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { isEnrolled };