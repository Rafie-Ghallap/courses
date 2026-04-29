const { coursesModel } = require("../../models/tracks/courses");
const { lessonsModel } = require("../../models/tracks/lessons");
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await lessonsModel.deleteMany({ courseId });

    const course = await coursesModel.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course and its lessons deleted" });
  } catch (err) {
    console.error("Error deleting course:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = deleteCourse;
