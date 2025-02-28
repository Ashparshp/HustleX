const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

// Send email verification
const sendVerificationEmail = async (user, verificationUrl) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f9fc; color: #333;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background-color: #5469d4; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HustleX</h1>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi ${
              user.name || "there"
            },</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thanks for signing up with HustleX! To get started, please verify your email address by clicking the button below:</p>
            
            <!-- Call to Action Button -->
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
              <tr>
                <td align="center">
                  <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #5469d4; color: white; text-decoration: none; padding: 14px 35px; border-radius: 4px; font-weight: 600; font-size: 16px;">Verify My Email</a>
                </td>
              </tr>
            </table>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">This link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            
            <p style="font-size: 14px; line-height: 1.4; margin-bottom: 25px; word-break: break-all; color: #5469d4;">
              ${verificationUrl}
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 5px;">Welcome aboard!</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">The HustleX Team</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f7f9fc; padding: 20px 30px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">© ${new Date().getFullYear()} HustleX. All rights reserved.</p>
            <p style="font-size: 12px; color: #999; margin: 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: "Verify Your Email - HustleX",
    html,
  });
};

// Send password reset email
const sendResetPasswordEmail = async (user, resetToken) => {
  const resetUrl = `${resetToken}`;

  const html = `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>If you didn't request this, ignore this email.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    html,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};
