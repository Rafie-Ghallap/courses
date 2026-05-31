const {coursesModel} = require("../../models/tracks/courses");
const { filterAllowedFields } = require("../../utils/filterAllowedFields");
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const updates = req.body;
    
    const allowedFields = ["title", "description", "price", "thumbnail", "level" , "language","duration","isPaid"];
    const filteredUpdates = filterAllowedFields(updates, allowedFields, req.user.role);

    const course = await coursesModel.findByIdAndUpdate(courseId, filteredUpdates, { new: true });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    console.error("Error updating course:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = updateCourse;