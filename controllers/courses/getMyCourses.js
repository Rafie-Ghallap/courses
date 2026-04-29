const { coursesModel } = require("../../models/tracks/courses");

const getMyCourses = async (req, res) => {
  try {

    const instructorId = req.user.id;
    const courses = await coursesModel.find({ instructorId }, "title description price thumbnail ratingAverage studentsCount");
    if (!courses.length) {
      return res.status(404).json({ message: "no courses found" });
    }
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching instructor's courses:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = getMyCourses;