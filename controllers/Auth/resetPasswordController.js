const { usersModel } = require("../../models/users/users");
const { otpData } = require("../../models/users/otp");
const { resetPasswordSchema } = require("../../validations/authValidations");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
	try {
		const { email, otpCode, newPassword, confirmPassword } = req.body;
		const parsed = resetPasswordSchema.safeParse({
			otpCode,
			newPassword,
			confirmPassword,
		});
		if (!parsed.success) {
			const firstError = parsed.error.issues[0].message;
			return res.status(400).json({ message: firstError });
		}
		const checkUser = await usersModel.findOne({ email }).select("+password");
		if (!checkUser) {
			return res.status(404).json({ message: "User not found" });
		}
		
		const checkOtp = await otpData.findOne({ userId: checkUser._id, for:"forgot-password" });
		if (!checkOtp) {
			return res.status(400).json({ message: "expired OTP code!" });
		}
		if (checkOtp.otpCode !== otpCode) {
			return res.status(400).json({ message: "Invalid OTP code!" });
		}
		
		const isSamePassword = await bcrypt.compare(
			newPassword,
			checkUser.password
		);
		if (isSamePassword) {
			return res
				.status(400)
				.json({ message: "New password cannot be the same as old password" });
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await usersModel.updateOne({ email: email }, { password: hashedPassword });
		await otpData.findOneAndDelete({ userId: checkUser._id });
		return res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = { resetPassword };
