const { enrollmentModel } = require("../../models/enrollment");

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentModel.find({
      student_id: req.user.id,
    }).populate("course_id");

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {getMyEnrollments};