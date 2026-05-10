const nodemailer = require('nodemailer');

// For development, we'll use a test account if no credentials are provided
async function createTransporter() {
    try {
        if (process.env.MAIL_HOST) {
            return nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });
        } else {
            // Fallback for development: Ethereal Email (fake SMTP)
            console.log("No MAIL_HOST found, attempting to create Ethereal account...");
            let testAccount = await nodemailer.createTestAccount();
            console.log("Using Ethereal Account:", testAccount.user);
            return nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
        }
    } catch (error) {
        console.error("Failed to create email transporter:", error);
        throw error;
    }
}

async function sendResetEmail(email, link) {
    try {
        console.log(`Attempting to send reset email to: ${email}`);
        const transporter = await createTransporter();
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"SkillBridge" <noreply@skillbridge.com>',
            to: email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click here to reset: ${link}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #3b82f6;">Password Reset</h2>
                    <p>You requested a password reset for your SkillBridge account.</p>
                    <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${link}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="color: #64748b; font-size: 0.875em;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        });

        console.log("Email sent successfully. Message ID: %s", info.messageId);
        // If using Ethereal, log the URL to preview the email
        if (!process.env.MAIL_HOST) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        return true;
    } catch (error) {
        console.error("CRITICAL: Error in sendResetEmail:", error);
        return false;
    }
}

module.exports = { sendResetEmail };
