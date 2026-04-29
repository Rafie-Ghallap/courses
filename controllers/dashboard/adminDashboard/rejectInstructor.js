const { usersModel } = require("../../../models/users/users");

const rejectInstructor = async (req, res) => {
  const userId = req.params.id;
  const user = await usersModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.instructorStatus !== "pending") {
    return res.status(400).json({ message: "No pending request" });
  }


  user.instructorStatus = "rejected";

  await user.save();

  res.json({ message: "Instructor request rejected" });
};

module.exports = {
  rejectInstructor
};