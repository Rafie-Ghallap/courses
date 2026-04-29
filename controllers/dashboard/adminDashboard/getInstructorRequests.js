const { usersModel } = require("../../../models/users/users");

const requestInstructor = async (req, res) => {
  const userId = req.user.id;
  const user = await usersModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "instructor") {
    return res.status(400).json({ message: "Already instructor" });
  }

  if (user.instructorStatus === "pending") {
    return res.status(400).json({ message: "Request already pending" });
  }

  user.instructorStatus = "pending";
  await user.save();

  res.json({ message: "Instructor request sent" });
};

module.exports = {
  requestInstructor
};