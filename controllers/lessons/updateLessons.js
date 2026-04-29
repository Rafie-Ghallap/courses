const { lessonsModel } = require("../../models/tracks/lessons");
const { filterAllowedFields } = require("../../utils/filterAllowedFields");
const updateLessons = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const updates = req.body;

    const allowedFields = ["title", "content", "videoUrl"];
    const filteredUpdates = filterAllowedFields(
      updates,
      allowedFields,
      req.user.role,
    );

    const lesson = await lessonsModel
      .findById(lessonId)
      .populate("courseId", "instructorId");

    const isAdmin = req.user.role === "admin";
    const isOwner =
      lesson.courseId.instructorId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Unauthorized to update this lesson",
      });
    }

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const updatedLesson = await lessonsModel.findByIdAndUpdate(
      lessonId,
      filteredUpdates,
      { new: true },
    );

    res.status(200).json({
      message: "Lesson edited successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

module.exports = updateLessons;
