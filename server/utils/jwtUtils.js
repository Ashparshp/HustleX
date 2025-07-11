const jwt = require("jsonwebtoken");

// Create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Set secure flag in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  // Remove password from response
  user.password = undefined;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};
