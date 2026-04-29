const getStudentDashboard = async (req, res) => {
  const enrollments = await enrollmentModel.find({
    user: req.user.id
  }).populate("course");

  res.json({
    courses: enrollments
  });
};

module.exports = {
  getStudentDashboard
};