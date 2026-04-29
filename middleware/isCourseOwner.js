const { coursesModel } = require("../models/tracks/courses");

const isCourseOwner = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const course = await coursesModel
      .findById(courseId)
      .select("instructorId");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not the owner of this course",
      });

    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { isCourseOwner };