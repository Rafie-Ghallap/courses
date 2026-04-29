const { usersModel } = require("../../models/users/users");
const { otpData } = require("../../models/users/otp");
const jwt = require("jsonwebtoken");
const { verifyEmailSchema } = require("../../validations/authValidations");

const verifyEmail = async (req, res) => {
  try {
    const { email, otp_code } = req.body;
    const parsed = verifyEmailSchema.safeParse({ email, otp_code });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0].message;
      return res.status(400).json({ message: firstError });
    }
    const checkUser = await usersModel.findOne({ email: email });
    if (!checkUser) {
      return res.status(400).json({ message: "User not found" });
    }
    if (checkUser.isEmailVerified === true) {
      return res.status(400).json({ message: "Account already verified" });
    }
    const checkOtp = await otpData.findOne({
      userId: checkUser._id,
      for: "verify-email",
    });
    if (!checkOtp) {
      return res.status(400).json({ message: "Invalid or expired email" });
    }
    if (checkOtp.otpCode !== otp_code) {
      return res.status(400).json({ message: "Invalid or expired otp" });
    }
    await otpData.findOneAndDelete({ userId: checkUser._id }); // delete otp
    await usersModel.findOneAndUpdate(
      { email: email },
      { isEmailVerified: true }
    );

    plainToken = {
      id: checkUser._id,
      role: checkUser.role,
      isEmailVerified: checkUser.isEmailVerified,
    };

    const token = jwt.sign(plainToken, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.token = token; 
    return res.json({ message: "Account verified successfully", token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyEmail };
