const { usersModel } = require("../../models/users/users");
const { otpData } = require("../../models/users/otp");
const { sendOTPSchema } = require("../../validations/authValidations");
const { SendEmailToUser } = require("../../utils/mailSender");

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const parsed = sendOTPSchema.safeParse({ email });

        if (!parsed.success) {
            const firstError = parsed.error.issues[0].message;
            return res.status(400).json({ message: firstError });
        }
    
        const checkUser = await usersModel.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const checkOtp = await otpData.findOne({ userId: checkUser._id, for:"forgot-password"});
        if (checkOtp) {
            return res.status(400).json({ message: "OTP already sent to your email" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const newOtp = new otpData({ 
            userId: checkUser._id, 
            otpCode: otp,
            for:"forgot-password"
        });
        await newOtp.save();
        await SendEmailToUser(email, "Reset Password", `Your password reset code is: ${otp}`);

        return res.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
		return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { forgotPassword };