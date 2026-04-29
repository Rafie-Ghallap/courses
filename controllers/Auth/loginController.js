const { usersModel } = require("../../models/users/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("../../validations/authValidations");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0].message;
      return res.status(400).json({ message: firstError });
    }
    const user = await usersModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "user not found!" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    plainToken={ id: user._id, role: user.role, isEmailVerified: user.isEmailVerified };

    const token = jwt.sign(
      plainToken,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    req.session.token = token;
    return res.status(200).json({ message: "successful Login!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginController };
