const { usersModel } = require('../../models/users/users');
const deleteUser = async (req, res) => {
  try {
    const user = await usersModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
module.exports = { deleteUser };