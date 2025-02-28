// server/controllers/auth.js
const crypto = require("crypto");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/jwtUtils");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/emailUtils");
const { sendVerificationSMS } = require("../utils/smsUtils");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email/${verificationToken}`;

    // Send verification email
    try {
      await sendVerificationEmail(user, verificationUrl);

      // Send verification SMS if phone provided
      if (phoneNumber) {
        const smsCode = user.getPhoneVerificationCode();
        await user.save({ validateBeforeSave: false });
        await sendVerificationSMS(phoneNumber, smsCode);
      }

      sendTokenResponse(user, 201, res);
    } catch (err) {
      console.error("Email sending error:", err);

      // Reset verification tokens
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      user.phoneVerificationCode = undefined;
      user.phoneVerificationExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      // Send an error HTML page
      return res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Failed</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f7f9fc;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              color: #333;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              padding: 40px;
              text-align: center;
              max-width: 500px;
              width: 90%;
            }
            .icon {
              width: 70px;
              height: 70px;
              margin: 0 auto 20px;
              background-color: #ff5252;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 15px;
              color: #ff5252;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 25px;
              color: #666;
            }
            .btn {
              display: inline-block;
              background-color: #5469d4;
              color: white;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 4px;
              font-weight: 600;
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #4054c7;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <h1>Verification Failed</h1>
            <p>The verification link is invalid or has expired. Please request a new verification email.</p>
            <a href="https://www.hustlex.in/" class="btn">Back to Home</a>
          </div>
        </body>
        </html>
      `);
    }

    // Set email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    // Send a beautiful success HTML page
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified</title>
        <style>
          @keyframes checkmark {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          @keyframes scale {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fc;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 90%;
          }
          .checkmark-circle {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background-color: #4caf50;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scale 1.5s ease-in-out;
          }
          .checkmark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: checkmark 1s forwards;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #4caf50;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #666;
          }
          .btn {
            display: inline-block;
            background-color: #5469d4;
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 4px;
            font-weight: 600;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background-color: #4054c7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="checkmark-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="checkmark">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Email Verified Successfully!</h1>
          <p>Your email address has been successfully verified. You can now access all features of your account.</p>
          <a href="https://www.hustlex.in/" class="btn">Continue to Home</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify phone number
// @route   POST /api/auth/verify-phone
// @access  Private
exports.verifyPhone = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide verification code",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if verification code is valid and not expired
    if (
      !user.phoneVerificationCode ||
      user.phoneVerificationCode !== verificationCode ||
      user.phoneVerificationExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
exports.resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email/${verificationToken}`;

    try {
      await sendVerificationEmail(user, verificationUrl);

      return res.status(200).json({
        success: true,
        message: "Verification email resent",
      });
    } catch (err) {
      console.error("Email sending error:", err);

      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Resend phone verification
// @route   POST /api/auth/resend-phone-verification
// @access  Private
exports.resendPhoneVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "No phone number associated with this account",
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: "Phone number already verified",
      });
    }

    // Generate new verification code
    const verificationCode = user.getPhoneVerificationCode();
    await user.save({ validateBeforeSave: false });

    try {
      await sendVerificationSMS(user.phoneNumber, verificationCode);

      return res.status(200).json({
        success: true,
        message: "Verification SMS resent",
      });
    } catch (err) {
      console.error("SMS sending error:", err);

      user.phoneVerificationCode = undefined;
      user.phoneVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "SMS could not be sent",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with that email",
      });
    }

    // Generate password reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const URL = "https://www.hustlex.in";
    const resetUrl = `${URL}/reset-password/${resetToken}`;

    try {
      await sendResetPasswordEmail(user, resetUrl);

      return res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (err) {
      console.error("Email sending error:", err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
    };

    // Update phone number if provided and different
    if (req.body.phoneNumber !== undefined) {
      const user = await User.findById(req.user.id);
      if (user.phoneNumber !== req.body.phoneNumber) {
        fieldsToUpdate.phoneNumber = req.body.phoneNumber;
        fieldsToUpdate.isPhoneVerified = false;

        // Generate verification code if new phone provided
        if (req.body.phoneNumber) {
          const updatedUser = await User.findById(req.user.id);
          const verificationCode = updatedUser.getPhoneVerificationCode();
          await updatedUser.save({ validateBeforeSave: false });

          try {
            await sendVerificationSMS(req.body.phoneNumber, verificationCode);
          } catch (err) {
            console.error("SMS sending error:", err);
          }
        }
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new passwords",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
