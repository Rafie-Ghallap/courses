const { usersModel } = require("../../../models/users/users");
const { coursesModel } = require("../../../models/tracks/courses");

const getAdminDashboard = async (req, res) => {
  const totalUsers = await usersModel.countDocuments();

  const totalCourses = await coursesModel.countDocuments();

  const totalStudents = await usersModel.countDocuments({
    role: "student",
  });

  const pendingInstructors = await usersModel.countDocuments({
    role: "instructor",
    status: "pending",
  },"username email instructorStatus");

  res.status(200).json({
    totalUsers,
    totalCourses,
    totalStudents,
    pendingInstructors,
  });
};

module.exports = {
  getAdminDashboard
};
