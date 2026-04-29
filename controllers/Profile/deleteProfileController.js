const { usersModel } = require("../../models/users/users");

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedUser = await usersModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { deleteProfile };
