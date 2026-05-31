const { usersModel } = require("../../models/users/users");
const {
  editUserProfileValidation
} = require("../../validations/profileValidations");

const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body;

    // validation
    const parsed = editUserProfileValidation.safeParse(userData);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message
      });
    }

    const originalData = await usersModel.findById(userId);

    if (!originalData) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    for (let key of Object.keys(userData)) {
      if (userData[key] !== originalData[key]) {
        updates[key] = userData[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields changed" });
    }

    const uniqueFields = ["email", "username"];
    for (let field of uniqueFields) {
      if (updates[field]) {
        const foundUser = await usersModel.findOne({
          [field]: updates[field],
          _id: { $ne: userId } 
        });

        if (foundUser) {
          return res.status(400).json({
            message: `${field} already used`
          });
        }
      }
    }

    if (updates.password) {
      return res.status(400).json({
        message: "Password cannot be updated here"
      });
    }

    
    if (updates.email) {
      updates.isEmailVerified = false;
    }

    const user = await usersModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      newUserData: user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = { editProfile };