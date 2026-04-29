const { usersModel } = require("../../models/users/users");

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await usersModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = { getProfile };