const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendBookingEmail = async (userEmail, username, eventTitle) => {
    try {
        const mailOptions = {
            from: `"EVESPHERE" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Event Booking Confirmation for " + eventTitle,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Event Booking Confirmation</title>
                </head>
                <body style="margin:0; padding:0; background-color:#F3F4F6; font-family:Arial, Helvetica, sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding:40px 15px;">
                        <tr>
                            <td align="center">
                                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.10);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#16A34A; padding:30px 25px; text-align:center;">
                                            <h1 style="margin:0; color:#FFFFFF; font-size:26px; font-weight:700;">
                                                Event Booking Confirmation
                                            </h1>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:35px 30px; color:#111827;">
                                            <h2 style="margin:0 0 15px; font-size:22px; color:#111827;">
                                                Hello ${username},
                                            </h2>
                                            <p style="margin:0; font-size:16px; line-height:1.7; color:#4B5563;">
                                                Your booking for the event "<strong>${eventTitle}</strong>" has been confirmed. We look forward to seeing you there!
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to ${userEmail} for event "${eventTitle}"`);
    } catch (error) {
        console.error("Error sending booking email:", error);
    }
};

exports.sendOtpEmail = async (email, otp, type) => {
    try {
        let title = "";
        let message = "";
        let accentColor = "#4F46E5";

        if (type === "account_verification") {
            title = "Verify Your Email Address";
            message =
                "Thank you for signing up. Please use the verification code below to confirm your email address and complete your registration.";
        } else if (type === "password_reset") {
            title = "Reset Your Password";
            message =
                "We received a request to reset your password. Use the verification code below to continue. If this was not you, you can safely ignore this email.";
            accentColor = "#DC2626";
        } else {
            title = "Confirm Your Event Booking";
            message =
                "You are almost done. Please use the verification code below to confirm your event booking and complete your reservation.";
            accentColor = "#16A34A";
        }

        const currentYear = new Date().getFullYear();

        const mailOptions = {
            from: `"EVESPHERE" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: title,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>${title}</title>
                </head>

                <body style="margin:0; padding:0; background-color:#F3F4F6; font-family:Arial, Helvetica, sans-serif;">

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding:40px 15px;">
                        <tr>
                            <td align="center">

                                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.10);">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:${accentColor}; padding:30px 25px; text-align:center;">
                                            <h1 style="margin:0; color:#FFFFFF; font-size:26px; font-weight:700;">
                                                ${title}
                                            </h1>
                                        </td>
                                    </tr>

                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:35px 30px; color:#111827;">

                                            <h2 style="margin:0 0 15px; font-size:22px; color:#111827;">
                                                Hello,
                                            </h2>

                                            <p style="margin:0; font-size:16px; line-height:1.7; color:#4B5563;">
                                                ${message}
                                            </p>

                                            <!-- OTP Box -->
                                            <div style="text-align:center; margin:35px 0;">
                                                <div style="
                                                    display:inline-block;
                                                    background-color:#F9FAFB;
                                                    border:2px dashed ${accentColor};
                                                    border-radius:12px;
                                                    padding:18px 35px;
                                                ">
                                                    <span style="
                                                        display:block;
                                                        color:${accentColor};
                                                        font-size:36px;
                                                        font-weight:700;
                                                        letter-spacing:8px;
                                                        line-height:1;
                                                    ">
                                                        ${otp}
                                                    </span>
                                                </div>
                                            </div>

                                            <p style="margin:0 0 12px; font-size:15px; color:#4B5563;">
                                                This OTP is valid for <strong>10 minutes</strong>.
                                            </p>

                                            <p style="margin:0 0 25px; font-size:15px; color:#4B5563;">
                                                For your security, do not share this code with anyone.
                                            </p>

                                            <!-- Security Notice -->
                                            <div style="
                                                background-color:#FEF3C7;
                                                border-left:4px solid #F59E0B;
                                                padding:14px 16px;
                                                border-radius:8px;
                                                margin:25px 0;
                                            ">
                                                <p style="margin:0; font-size:14px; color:#92400E; line-height:1.6;">
                                                    If you did not request this OTP, please ignore this email. Your account will remain secure.
                                                </p>
                                            </div>

                                            <p style="margin:30px 0 0; font-size:15px; color:#374151; line-height:1.6;">
                                                Best Regards,<br />
                                                <strong>EVESPHERE Team</strong>
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#F9FAFB; padding:18px 25px; text-align:center; border-top:1px solid #E5E7EB;">
                                            <p style="margin:0; font-size:13px; color:#6B7280;">
                                                © ${currentYear} EVESPHERE. All Rights Reserved.
                                            </p>
                                            <p style="margin:8px 0 0; font-size:12px; color:#9CA3AF;">
                                                This is an automated email. Please do not reply.
                                            </p>
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email} for ${type}`);

    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
};

exports.sendBookingEmail = sendBookingEmail;
