import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getError = (err) => err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.';

    const requestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
            setStep(2);
        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await api.post('/auth/verify-reset-otp', { email, otp });
            setResetToken(data.resetToken);
            setMessage('OTP verified. Choose your new password.');
            setStep(3);
        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 4) return setError('Password must be at least 4 characters long.');
        if (password !== confirmPassword) return setError('Passwords do not match.');

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { resetToken, password });
            navigate('/login', { replace: true, state: { message: 'Password reset successfully. You can now sign in.' } });
        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setOtp('');
            setMessage(data.message);
        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500">
                    {step === 1 && 'Enter your account email to receive an OTP'}
                    {step === 2 && `Enter the 6-digit code sent to ${email}`}
                    {step === 3 && 'Create a secure new password'}
                </p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-100">{error}</div>}
            {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-center border border-green-100">{message}</div>}

            {step === 1 && (
                <form onSubmit={requestOtp} className="space-y-6">
                    <Field label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" />
                    <SubmitButton loading={loading}>Send Reset OTP</SubmitButton>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={verifyOtp} className="space-y-6">
                    <Field label="Verification Code (OTP)" type="text" value={otp} onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="6-digit code" centered />
                    <SubmitButton loading={loading}>Verify OTP</SubmitButton>
                    <button type="button" disabled={loading} onClick={resendOtp} className="w-full text-sm font-semibold text-gray-700 hover:underline disabled:opacity-50">Resend OTP</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={resetPassword} className="space-y-6">
                    <Field label="New Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" minLength={4} />
                    <Field label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" minLength={4} />
                    <SubmitButton loading={loading}>Set New Password</SubmitButton>
                </form>
            )}

            <p className="text-center mt-8 text-gray-600">
                Remember your password? <Link to="/login" className="text-gray-900 font-bold hover:underline">Sign in</Link>
            </p>
        </div>
    );
};

const Field = ({ label, value, onChange, centered, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm ${centered ? 'font-bold tracking-widest text-center text-lg' : ''}`}
            {...props}
        />
    </div>
);

const SubmitButton = ({ loading, children }) => (
    <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md disabled:opacity-60">
        {loading ? 'Processing...' : children}
    </button>
);

export default ForgotPassword;
