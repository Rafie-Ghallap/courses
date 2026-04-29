const express = require('express')
const router = express.Router()

const { loginController } = require('../controllers/Auth/loginController');
const { registerController } = require('../controllers/Auth/registerController');
const { forgotPassword } = require('../controllers/Auth/forgotPasswordController');
const { resetPassword } = require('../controllers/Auth/resetPasswordController');
const { verifyEmail } = require('../controllers/Auth/verifyEmailController');
const { sendOTP } = require('../controllers/Auth/sendOTPController');
const { logout } = require('../controllers/Auth/logoutController');


router.post('/login', loginController)
router.post('/register', registerController)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify-email', verifyEmail)
router.post('/send-otp', sendOTP)
router.delete('/logout', logout)


module.exports = router