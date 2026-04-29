const { enrollmentModel } = require("../../models/enrollment");
const { coursesModel } = require("../../models/tracks/courses");

const enrollCourse = async (req, res) => {
  try {

    const courseId  = req.params.id;
    const user = req.user;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll" });
    }

    const course = await coursesModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingEnrollment = await enrollmentModel.findOne({
      student_id: user.id,
      course_id: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await enrollmentModel.create({
      student_id: user.id,
      course_id: courseId,
    });

    await coursesModel.findByIdAndUpdate(courseId, {
      $inc: { studentsCount: 1 },// Increment students count with amount of 1
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment
    });
  } catch (err) {
    console.error("Enrollment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  enrollCourse
};
