const getInstructorDashboard = async (req, res) => {
  const courses = await coursesModel.find({
    instructor: req.user.id
  });

  const totalStudents = await coursesModel.aggregate([
    { $match: { instructor: req.user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: "$studentsCount" }
      }
    }
  ]);

  res.json({
    courses,
    totalStudents: totalStudents[0]?.total || 0
  });
};

module.exports = {
  getInstructorDashboard
};