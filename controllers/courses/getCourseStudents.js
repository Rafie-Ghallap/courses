const { enrollmentModel } = require("../../models/enrollment");
const { coursesModel } = require("../../models/tracks/courses");
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await coursesModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const students = await enrollmentModel.find({
      course_id: courseId,
    }).populate("student_id", "username email");

    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching course students:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports =  getCourseStudents ;