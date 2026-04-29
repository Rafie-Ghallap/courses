const { usersModel } = require("../../models/users/users");
const bcrypt = require("bcrypt");
const { registerSchema } = require("../../validations/authValidations");

const registerController = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, phone } = req.body;
    const parsed = registerSchema.safeParse({
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
    });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0].message;
      return res.status(400).json({ message: firstError });
    }
    const existingUser = await usersModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usersModel({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phone
    });
    await newUser.save();

    return res.status(201).json({ message: "registeration done!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { registerController };
