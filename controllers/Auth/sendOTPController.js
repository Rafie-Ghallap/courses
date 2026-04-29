const { usersModel } = require("../../models/users/users");
const { otpData } = require("../../models/users/otp");
const { SendEmailToUser } = require("../../utils/mailSender");
const { sendOTPSchema } = require("../../validations/authValidations");

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const parsed = sendOTPSchema.safeParse({ email });
        if (!parsed.success) {
            const firstError = parsed.error.issues[0].message;
            return res.status(400).json({ message: firstError });
        }
        const checkUser = await usersModel.findOne({ email });
        if (!checkUser) {
            return res.status(400).json({ message: "User not found" });
        }
        const checkOTP = await otpData.findOne({ userId: checkUser._id, for:"verify-email" });
        if (checkOTP) {
            return res.status(400).json({ message: "OTP already sent to your email" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const newOtp = new otpData({
            userId: checkUser._id,
            otpCode: otp,
            for:"verify-email"
        });
        await newOtp.save();
        await SendEmailToUser(email, "Email Verification", `Your verify email code is: ${otp}`);
        return res.json({ message: "OTP sent to your email" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { sendOTP };