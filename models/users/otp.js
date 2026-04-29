const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	otpCode: { type: String, required: true, length: 6 },
	for:{type:String, enum:["forgot-password", "verify-email"]},
	type: { type: String, enum: ["email", "sms"], default: "email" },
	createdAt: { type: Date, default: Date.now, expires: 300 }, // auto delete after 5 mins
});

const otpData = mongoose.model("otp", otpSchema);
module.exports = { otpData };
