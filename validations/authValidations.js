const z = require("zod");

// DRY (Don’t Repeat Yourself)
const emailField = z.string({ required_error: "Email is required" }).trim().email({ message: "Invalid email format" });
const passwordField = z.string().trim().min(8, { message: "Password must be at least 8 characters long" });
const otpField = z.string({ required_error: "OTP is required" }).trim().min(6, { message: "OTP must be at least 6 characters long" });

const loginSchema = z.object({ email: emailField, password: passwordField });

const registerSchema = z.object({
    firstName: z.string({ required_error: "First name is required" }).trim().min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string({ required_error: "Last name is required" }).trim().min(3, { message: "Last name must be at least 3 characters long" }),
    username: z.string({ required_error: "Username is required" }).trim().min(3, { message: "Username must be at least 3 characters long" }),
    email: emailField,
    password: passwordField,
    phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Phone number must be a valid Egyptian number (starts with 010, 011, 012, or 015) and contain 11 digits" }),
});

const sendOTPSchema = z.object({ 
    email: emailField 
});

const resetPasswordSchema = z.object({
    otpCode: otpField,
    newPassword: passwordField, 
    confirmPassword: z.string().trim().nonempty({ message: "Confirm Password cannot be empty" }),
}).refine((data) => data.newPassword === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match", })

const verifyEmailSchema = z.object({ email: emailField, otp_code: otpField });

module.exports = {
    registerSchema,
    loginSchema,
    sendOTPSchema,
    resetPasswordSchema,
    verifyEmailSchema
};