const { lessonsModel } = require("../../models/tracks/lessons");
const { coursesModel } = require("../../models/tracks/courses");

const deleteLesson = async (req, res) => {
  try {
    const lesson = await lessonsModel
      .findById(req.params.id)
      .populate("courseId", "instructorId");

    const isAdmin = req.user.role === "admin";
    const isOwner = lesson.courseId.instructorId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Unauthorized to delete this lesson",
      });
    }

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!lesson.courseId) {
      return res
        .status(400)
        .json({ message: "Course not found for this lesson" });
    }

    await lessonsModel.findByIdAndDelete(req.params.id);

    await coursesModel.findByIdAndUpdate(lesson.courseId._id, {
      $inc: { lessonsCount: -1 },
    });

    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = deleteLesson;
