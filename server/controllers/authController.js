const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/email');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();


//register user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    let userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({ name, email, password: hashedPassword,role: 'user', isVerified: false});

        const otp = Math.floor(100000 + Math.floor(Math.random() * 900000)).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        await OTP.create({ email, otp, action: 'account_verification'});
        await sendOtpEmail(email, otp, 'account_verification');
        
        
        res.status(201).json({ 
            message: 'User registered successfully. Please verify your email using the OTP sent.',
            email: user.email
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

    const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

    if(!user.isVerified && user.role === 'user') {
        const otp = Math.floor(100000 + Math.floor(Math.random() * 900000)).toString();
        await OTP.deleteMany({ email, action: 'account_verification' }); // Delete any existing OTPs for this email
        await OTP.create({ email, otp, action: 'account_verification'});
        await sendOtpEmail(email, otp, 'account_verification');
            return res.status(400).json({ 
                message: 'Account not verified. Please check your email for the OTP to verify your account.'
             });
    }

    res.json({
        message: 'Login successful',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    }
)
};

//verify otp
exports.verifyotp = async (req, res) => {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

    if(!otpRecord) {
           return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find and update the user, returning the updated document
    const user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
    );

    if (!user) {
           return res.status(400).json({ message: 'User not found' });
    }

    await OTP.deleteOne({ email, otp, action: 'account_verification' });

    res.json({
        message: 'Account verified successfully. You can now log in',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    });
};

// Send an OTP without revealing whether an account exists for the email.
exports.forgotPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (user) {
            const otp = generateOtp();
            await OTP.deleteMany({ email, action: 'password_reset' });
            await OTP.create({ email, otp, action: 'password_reset' });
            await sendOtpEmail(email, otp, 'password_reset');
        }

        res.json({ message: 'A reset OTP has been sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Unable to send reset OTP. Please try again.' });
    }
};

// Exchange a valid OTP for a short-lived, single-purpose reset token.
exports.verifyResetOtp = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const otp = String(req.body.otp || '').trim();

        if (!email || !/^\d{6}$/.test(otp)) {
                return res.status(400).json({ message: 'Enter a valid 6-digit OTP' });
        }

        const otpRecord = await OTP.findOne({ email, otp, action: 'password_reset' });
        if (!otpRecord) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email }).select('+passwordResetVersion');
        if (!user) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await OTP.deleteMany({ email, action: 'password_reset' });
        const resetToken = jwt.sign(
            { id: user._id, purpose: 'password_reset', version: user.passwordResetVersion || 0 },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.json({ message: 'OTP verified successfully', resetToken });
    } catch (error) {
        console.error('Verify reset OTP error:', error);
        res.status(500).json({ error: 'Unable to verify OTP. Please try again.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, password } = req.body;
        if (!password || password.length < 4) {
            return res.status(400).json({ error: 'Password must be at least 4 characters long' });
        }

        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch {
            return res.status(400).json({ error: 'Reset session is invalid or expired. Please request a new OTP.' });
        }

        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ error: 'Invalid reset session' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            {
                _id: decoded.id,
                $or: [
                    { passwordResetVersion: decoded.version },
                    ...(decoded.version === 0 ? [{ passwordResetVersion: { $exists: false } }] : [])
                ]
            },
            {
                $set: { password: hashedPassword },
                $inc: { passwordResetVersion: 1 }
            }
        );
        if (!user) {
            return res.status(400).json({ error: 'Reset session has already been used or is invalid' });
        }

        res.json({ message: 'Password reset successfully. You can now sign in.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Unable to reset password. Please try again.' });
    }
};
