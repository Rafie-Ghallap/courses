const { usersModel } = require("e:/nodes/codopia/Codopia/back-end/models/users/users");

const getUserById = async(req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "user ID is required" });
        }
        const user = await usersModel.findById(userId, "firstName lastName username email role address phoneNumber about");
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

module.exports = {getUserById}