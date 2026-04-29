const { lessonsModel } = require("../../models/tracks/lessons");

const getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const foundLesson = await lessonsModel.findById(lessonId);

    if (!foundLesson) {
      return res.json({ message: "lesson not found!" });
    }

    res.json({ lesson: foundLesson });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
module.exports = getLessonById;
