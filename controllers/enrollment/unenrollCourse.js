const { enrollmentModel } = require("../../models/enrollment");
const { coursesModel } = require("../../models/tracks/courses");

const unenrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const  courseId  = req.params.id;

    const enrollment = await enrollmentModel.findOneAndDelete({
      student_id: userId,
      course_id: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    
    await coursesModel.findByIdAndUpdate(courseId, {
      $inc: { studentsCount: -1 },
    });

    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    console.error("Unenrollment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  unenrollCourse
};