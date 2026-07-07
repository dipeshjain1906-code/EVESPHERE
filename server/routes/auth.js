const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    verifyotp,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyotp);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
