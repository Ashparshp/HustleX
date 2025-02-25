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
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Set email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
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
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

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


// server/controllers/category.js
const Category = require("../models/Category");

// Handle errors
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get all categories for a specific type
// @route   GET /api/categories?type=working-hours
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    // Validate type
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Category type is required",
      });
    }

    const categories = await Category.find({
      user: req.user.id,
      type,
    }).sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    handleError(res, error, "Error getting categories");
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const { name, type, color, icon, description } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    // Check for duplicates
    const existingCategory = await Category.findOne({
      user: req.user.id,
      name: name.trim(),
      type,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Create new category
    const category = await Category.create({
      user: req.user.id,
      name: name.trim(),
      type,
      color,
      icon,
      description,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleError(res, error, "Error creating category");
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;

    // Find category and check ownership
    let category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or not authorized",
      });
    }

    // Check for duplicates if name is changed
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        user: req.user.id,
        name: name.trim(),
        type: category.type,
        _id: { $ne: category._id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description;

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleError(res, error, "Error updating category");
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    // Find category and check ownership
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or not authorized",
      });
    }

    // Use deleteOne() instead of remove()
    await category.deleteOne();
    // Alternatively: await Category.deleteOne({ _id: req.params.id, user: req.user.id });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting category");
  }
};

// @desc    Get predefined categories for a module
// @route   GET /api/categories/defaults/:type
// @access  Private
exports.getDefaultCategories = async (req, res) => {
  try {
    const { type } = req.params;

    let defaultCategories = [];

    // Different defaults based on module type
    switch (type) {
      case "working-hours":
        defaultCategories = [
          { name: "Coding", color: "#3498db", icon: "code" },
          { name: "Learning", color: "#2ecc71", icon: "book" },
          { name: "Project Work", color: "#e74c3c", icon: "briefcase" },
          { name: "Other", color: "#95a5a6", icon: "more-horizontal" },
        ];
        break;
      case "skills":
        defaultCategories = [
          { name: "MERN Stack", color: "#3498db", icon: "server" },
          { name: "Java & Ecosystem", color: "#e67e22", icon: "coffee" },
          { name: "DevOps", color: "#9b59b6", icon: "settings" },
          { name: "Data Science & ML", color: "#2ecc71", icon: "bar-chart-2" },
          { name: "Mobile Development", color: "#e74c3c", icon: "smartphone" },
          { name: "Go Backend", color: "#1abc9c", icon: "send" },
        ];
        break;
      case "schedule":
        defaultCategories = [
          { name: "DSA", color: "#3498db", icon: "code" },
          { name: "System Design", color: "#9b59b6", icon: "git-branch" },
          { name: "Development", color: "#2ecc71", icon: "code-sandbox" },
          { name: "Learning", color: "#f39c12", icon: "book-open" },
          { name: "Problem Solving", color: "#e74c3c", icon: "zap" },
          { name: "Other", color: "#95a5a6", icon: "more-horizontal" },
        ];
        break;
      case "timetable":
        defaultCategories = [
          { name: "Career", color: "#3498db", icon: "briefcase" },
          { name: "Backend", color: "#2ecc71", icon: "server" },
          { name: "Core", color: "#e74c3c", icon: "cpu" },
          { name: "Frontend", color: "#f39c12", icon: "layout" },
          { name: "Mobile", color: "#9b59b6", icon: "smartphone" },
        ];
        break;
      case "goals":
        defaultCategories = [
          { name: "LeetCode", color: "#f39c12", icon: "code" },
          { name: "CodeChef", color: "#3498db", icon: "hash" },
          { name: "CodeForces", color: "#e74c3c", icon: "activity" },
          { name: "HackerRank", color: "#2ecc71", icon: "terminal" },
        ];
        break;
      default:
        break;
    }

    res.json({
      success: true,
      data: defaultCategories,
    });
  } catch (error) {
    handleError(res, error, "Error getting default categories");
  }
};


// server/controllers/contests.js
const Contest = require("../models/Contest");
const Category = require("../models/Category");

// Helper function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get all contests for the authenticated user
// @route   GET /api/contests
// @access  Private
const getContests = async (req, res) => {
  try {
    const { platform, participated, startDate, endDate, sort = 'date' } = req.query;
    let query = { user: req.user.id };
    
    // Apply filters if provided
    if (platform) {
      query.platform = platform;
    }
    
    if (participated !== undefined) {
      query.participated = participated === 'true';
    }
    
    // Date range filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Determine sort direction
    let sortDirection = -1; // Default to descending (newest first)
    let sortField = 'date';
    
    if (sort) {
      if (sort.startsWith('-')) {
        sortField = sort.substring(1);
        sortDirection = -1;
      } else {
        sortField = sort;
        sortDirection = 1;
      }
    }
    
    const sortOptions = { [sortField]: sortDirection };
    
    const contests = await Contest.find(query).sort(sortOptions);
    
    // Calculate stats
    const stats = {
      total: contests.length,
      participated: contests.filter(c => c.participated).length,
      platforms: {}
    };
    
    // Group by platform
    contests.forEach(contest => {
      if (!stats.platforms[contest.platform]) {
        stats.platforms[contest.platform] = {
          total: 0,
          participated: 0
        };
      }
      
      stats.platforms[contest.platform].total++;
      
      if (contest.participated) {
        stats.platforms[contest.platform].participated++;
      }
    });
    
    res.json({
      success: true,
      count: contests.length,
      stats,
      data: contests
    });
  } catch (error) {
    handleError(res, error, "Error retrieving contests");
  }
};

// @desc    Add a new contest
// @route   POST /api/contests
// @access  Private
const addContest = async (req, res) => {
  try {
    const { platform, name, date, participated, rank, solved, totalProblems, duration, notes } = req.body;
    
    if (!platform || !name || !date) {
      return res.status(400).json({
        success: false,
        message: "Platform, name, and date are required"
      });
    }
    
    const contest = new Contest({
      user: req.user.id,
      platform,
      name: name.trim(),
      date,
      participated,
      rank: participated && rank ? parseInt(rank) : null,
      solved: participated && solved ? parseInt(solved) : null,
      totalProblems: totalProblems ? parseInt(totalProblems) : null,
      duration: duration ? parseInt(duration) : null,
      notes
    });
    
    const savedContest = await contest.save();
    
    res.status(201).json({
      success: true,
      data: savedContest
    });
  } catch (error) {
    handleError(res, error, "Error adding contest");
  }
};

// @desc    Update a contest
// @route   PUT /api/contests/:id
// @access  Private
const updateContest = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, name, date, participated, rank, solved, totalProblems, duration, notes } = req.body;
    
    // Find contest and verify ownership
    const contest = await Contest.findOne({
      _id: id,
      user: req.user.id
    });
    
    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found or not authorized"
      });
    }
    
    // Update fields
    if (platform) contest.platform = platform;
    if (name) contest.name = name.trim();
    if (date) contest.date = date;
    
    if (participated !== undefined) {
      contest.participated = participated;
      
      // Reset rank and solved if not participated
      if (!participated) {
        contest.rank = null;
        contest.solved = null;
      }
    }
    
    if (participated && rank !== undefined) {
      contest.rank = rank ? parseInt(rank) : null;
    }
    
    if (participated && solved !== undefined) {
      contest.solved = solved ? parseInt(solved) : null;
    }
    
    if (totalProblems !== undefined) {
      contest.totalProblems = totalProblems ? parseInt(totalProblems) : null;
    }
    
    if (duration !== undefined) {
      contest.duration = duration ? parseInt(duration) : null;
    }
    
    if (notes !== undefined) {
      contest.notes = notes;
    }
    
    await contest.save();
    
    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    handleError(res, error, "Error updating contest");
  }
};

// @desc    Delete a contest
// @route   DELETE /api/contests/:id
// @access  Private
const deleteContest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find contest and verify ownership
    const contest = await Contest.findOne({
      _id: id,
      user: req.user.id
    });
    
    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found or not authorized"
      });
    }
    
    await contest.remove();
    
    res.json({
      success: true,
      message: "Contest deleted successfully"
    });
  } catch (error) {
    handleError(res, error, "Error deleting contest");
  }
};

// @desc    Get contest platforms for the user
// @route   GET /api/contests/platforms
// @access  Private
const getPlatforms = async (req, res) => {
  try {
    // Get all unique platforms used in contests by this user
    const usedPlatforms = await Contest.distinct('platform', { user: req.user.id });
    
    // Get all categories (platforms) created by the user
    const userPlatforms = await Category.find({ 
      user: req.user.id,
      type: 'goals'
    });
    
    // Combine and deduplicate
    const allPlatforms = [...new Set([
      ...usedPlatforms,
      ...userPlatforms.map(p => p.name)
    ])];
    
    res.json({
      success: true,
      platforms: allPlatforms
    });
  } catch (error) {
    handleError(res, error, "Error getting platforms");
  }
};

// @desc    Get contest statistics
// @route   GET /api/contests/stats
// @access  Private
const getContestStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user.id };
    
    // Apply date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const contests = await Contest.find(query);
    
    if (contests.length === 0) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          participated: 0,
          participation_rate: 0,
          platforms: {},
          best_rank: null,
          average_rank: null,
          average_solve_rate: null,
          recent_trend: []
        }
      });
    }
    
    // Basic stats
    const participated = contests.filter(c => c.participated);
    
    // Calculate platform breakdown
    const platforms = contests.reduce((acc, contest) => {
      if (!acc[contest.platform]) {
        acc[contest.platform] = {
          total: 0,
          participated: 0,
          avg_rank: null,
          best_rank: null
        };
      }
      
      acc[contest.platform].total++;
      
      if (contest.participated) {
        acc[contest.platform].participated++;
        
        // Collect ranks for averaging
        if (contest.rank) {
          if (!acc[contest.platform].ranks) {
            acc[contest.platform].ranks = [];
          }
          acc[contest.platform].ranks.push(contest.rank);
          
          // Track best rank
          if (!acc[contest.platform].best_rank || contest.rank < acc[contest.platform].best_rank) {
            acc[contest.platform].best_rank = contest.rank;
          }
        }
      }
      
      return acc;
    }, {});
    
    // Calculate average ranks for each platform
    Object.keys(platforms).forEach(platform => {
      if (platforms[platform].ranks && platforms[platform].ranks.length > 0) {
        platforms[platform].avg_rank = Math.round(
          platforms[platform].ranks.reduce((sum, rank) => sum + rank, 0) / 
          platforms[platform].ranks.length
        );
        delete platforms[platform].ranks; // Remove temporary ranks array
      }
    });
    
    // Find best rank overall
    const rankedContests = participated.filter(c => c.rank);
    const bestRank = rankedContests.length > 0 
      ? Math.min(...rankedContests.map(c => c.rank))
      : null;
    
    // Calculate average rank overall
    const averageRank = rankedContests.length > 0
      ? Math.round(rankedContests.reduce((sum, c) => sum + c.rank, 0) / rankedContests.length)
      : null;
    
    // Calculate average solve rate
    const contestsWithSolveRate = participated.filter(c => c.solved !== null && c.totalProblems !== null);
    const averageSolveRate = contestsWithSolveRate.length > 0
      ? contestsWithSolveRate.reduce((sum, c) => sum + (c.solved / c.totalProblems), 0) / contestsWithSolveRate.length
      : null;
    
    // Calculate recent trend (last 10 contests)
    const recentContests = [...participated]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map(c => ({
        name: c.name,
        platform: c.platform,
        date: c.date,
        rank: c.rank,
        solved: c.solved,
        totalProblems: c.totalProblems
      }));
    
    const stats = {
      total: contests.length,
      participated: participated.length,
      participation_rate: (participated.length / contests.length) * 100,
      platforms,
      best_rank: bestRank,
      average_rank: averageRank,
      average_solve_rate: averageSolveRate,
      recent_trend: recentContests
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    handleError(res, error, "Error getting contest statistics");
  }
};

module.exports = {
  getContests,
  addContest,
  updateContest,
  deleteContest,
  getPlatforms,
  getContestStats
};

// server/controllers/leetcode.js
const LeetCode = require("../models/LeetCode");

// Helper function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get LeetCode stats for the authenticated user
// @route   GET /api/leetcode/stats
// @access  Private
exports.getLeetCodeStats = async (req, res) => {
  try {
    let stats = await LeetCode.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    // If no stats exist, return default values
    if (!stats) {
      return res.json({
        success: true,
        data: {
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalEasy: 0,
          totalMedium: 0,
          totalHard: 0,
          ranking: null,
          username: null,
          lastUpdated: new Date(),
        }
      });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    handleError(res, error, "Error getting LeetCode stats");
  }
};

// @desc    Update LeetCode stats for the authenticated user
// @route   POST /api/leetcode/stats
// @access  Private
exports.updateLeetCodeStats = async (req, res) => {
  try {
    const { 
      totalSolved, 
      easySolved, 
      mediumSolved, 
      hardSolved, 
      totalEasy, 
      totalMedium, 
      totalHard,
      ranking,
      username 
    } = req.body;

    // Create a new record
    const newStats = new LeetCode({
      user: req.user.id,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalEasy,
      totalMedium,
      totalHard,
      ranking,
      username,
      lastUpdated: new Date(),
    });

    await newStats.save();
    
    res.json({
      success: true,
      data: newStats
    });
  } catch (error) {
    handleError(res, error, "Error updating LeetCode stats");
  }
};

// @desc    Get LeetCode history for the authenticated user
// @route   GET /api/leetcode/history
// @access  Private
exports.getLeetCodeHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const history = await LeetCode.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    if (history.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Calculate progress over time
    const progressHistory = history.map(entry => ({
      date: entry.createdAt,
      totalSolved: entry.totalSolved,
      easySolved: entry.easySolved,
      mediumSolved: entry.mediumSolved,
      hardSolved: entry.hardSolved,
      ranking: entry.ranking
    }));
    
    res.json({
      success: true,
      data: history,
      progressHistory
    });
  } catch (error) {
    handleError(res, error, "Error getting LeetCode history");
  }
};

// @desc    Delete LeetCode stats entry
// @route   DELETE /api/leetcode/stats/:id
// @access  Private
exports.deleteLeetCodeStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and verify ownership
    const stats = await LeetCode.findOne({
      _id: id,
      user: req.user.id
    });
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "Stats entry not found or not authorized"
      });
    }
    
    await stats.remove();
    
    res.json({
      success: true,
      message: "Stats entry deleted successfully"
    });
  } catch (error) {
    handleError(res, error, "Error deleting LeetCode stats");
  }
};

// server/controllers/schedule.js
const Schedule = require("../models/Schedule");
const ScheduleTemplate = require("../models/ScheduleTemplate");
const Category = require("../models/Category");

// Helper function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get schedules for a date range
// @route   GET /api/schedules
// @access  Private
exports.getSchedules = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let query = { user: req.user.id };

    // Apply date range filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Apply status filter if provided
    if (status) {
      query.status = status;
    }

    const schedules = await Schedule.find(query).sort({ date: 1 });

    // Calculate summary statistics
    const stats = {
      total: schedules.length,
      totalHours: schedules.reduce((sum, schedule) => sum + schedule.totalHours, 0),
      planned: schedules.filter(s => s.status === 'Planned').length,
      inProgress: schedules.filter(s => s.status === 'In Progress').length,
      completed: schedules.filter(s => s.status === 'Completed').length,
      averageCompletion: schedules.length > 0 
        ? schedules.reduce((sum, s) => sum + s.overallCompletion, 0) / schedules.length
        : 0,
      categories: {}
    };

    // Build category breakdown
    schedules.forEach(schedule => {
      schedule.items.forEach(item => {
        if (!stats.categories[item.category]) {
          stats.categories[item.category] = {
            totalItems: 0,
            completedItems: 0,
            totalHours: 0
          };
        }

        // Calculate item hours
        const start = new Date(`2000-01-01T${item.startTime}`);
        const end = new Date(`2000-01-01T${item.endTime}`);
        const itemHours = (end - start) / (1000 * 60 * 60);

        stats.categories[item.category].totalItems++;
        stats.categories[item.category].totalHours += itemHours;

        if (item.completed) {
          stats.categories[item.category].completedItems++;
        }
      });
    });

    // Calculate completion rates for each category
    Object.keys(stats.categories).forEach(category => {
      const { totalItems, completedItems } = stats.categories[category];
      stats.categories[category].completionRate = totalItems > 0 
        ? (completedItems / totalItems) * 100
        : 0;
    });

    res.json({
      success: true,
      count: schedules.length,
      stats,
      data: schedules
    });
  } catch (error) {
    handleError(res, error, "Error getting schedules");
  }
};

// @desc    Get a single day's schedule
// @route   GET /api/schedules/:id
// @access  Private
exports.getSchedule = async (req, res) => {
  try {
    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized"
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    handleError(res, error, "Error getting schedule");
  }
};

// @desc    Create a new schedule
// @route   POST /api/schedules
// @access  Private
exports.createSchedule = async (req, res) => {
  try {
    const { date, items, templateId } = req.body;

    // Format date to remove time component
    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);

    // Check if schedule already exists for this date and user
    const existingSchedule = await Schedule.findOne({
      user: req.user.id,
      date: scheduleDate
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Schedule already exists for this date"
      });
    }

    // Determine day type (Weekend or Weekday)
    const dayType = scheduleDate.getDay() % 6 === 0 ? "Weekend" : "Weekday";

    let scheduleItems = items || [];
    let templateName = null;

    // If templateId is provided, use template items
    if (templateId) {
      const template = await ScheduleTemplate.findOne({
        _id: templateId,
        user: req.user.id
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found or not authorized"
        });
      }

      scheduleItems = template.items.map(item => ({
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        category: item.category,
        priority: item.priority,
        notes: item.notes,
        completed: false
      }));

      templateName = template.name;
    }

    const schedule = new Schedule({
      user: req.user.id,
      date: scheduleDate,
      dayType,
      items: scheduleItems,
      templateName
    });

    await schedule.save();

    res.status(201).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    handleError(res, error, "Error creating schedule");
  }
};

// @desc    Update a schedule
// @route   PUT /api/schedules/:id
// @access  Private
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized"
      });
    }

    // Extract fields to update
    const { date, items, dayType, status } = req.body;

    // Update fields if provided
    if (date) {
      schedule.date = new Date(date);
    }

    if (items) {
      schedule.items = items;
    }

    if (dayType) {
      schedule.dayType = dayType;
    }

    if (status) {
      schedule.status = status;
    }

    // Save the updated schedule
    const updatedSchedule = await schedule.save();

    res.json({
      success: true,
      data: updatedSchedule
    });
  } catch (error) {
    handleError(res, error, "Error updating schedule");
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Private
exports.deleteSchedule = async (req, res) => {
  try {
    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized"
      });
    }

    await schedule.remove();

    res.json({
      success: true,
      message: "Schedule deleted successfully"
    });
  } catch (error) {
    handleError(res, error, "Error deleting schedule");
  }
};

// @desc    Add item to schedule
// @route   POST /api/schedules/:id/items
// @access  Private
exports.addScheduleItem = async (req, res) => {
  try {
    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized"
      });
    }

    // Validate required fields
    const { title, startTime, endTime, category } = req.body;
    if (!title || !startTime || !endTime || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, start time, end time, and category are required"
      });
    }

    schedule.items.push(req.body);
    await schedule.save();

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    handleError(res, error, "Error adding schedule item");
  }
};

// @desc    Update schedule item
// @route   PUT /api/schedules/:id/items/:itemId
// @access  Private
exports.updateScheduleItem = async (req, res) => {
  try {
    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized"
      });
    }

    const item = schedule.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Schedule item not found"
      });
    }

    // Update item fields
    Object.keys(req.body).forEach((key) => {
      item[key] = req.body[key];
    });

    await schedule.save();

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    handleError(res, error, "Error updating schedule item");
  }
};

// @desc    Delete schedule item
// @route   DELETE /api/schedules/:id/items/:itemId
// @access  Private
exports.deleteScheduleItem = async (req, res) => {
  try {
    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized"
      });
    }

    // Remove the item
    schedule.items = schedule.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await schedule.save();

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    handleError(res, error, "Error deleting schedule item");
  }
};

// @desc    Get schedule categories
// @route   GET /api/schedules/categories
// @access  Private
exports.getScheduleCategories = async (req, res) => {
  try {
    // Find all unique categories used in schedules
    const schedules = await Schedule.find({ user: req.user.id });
    
    const categoriesSet = new Set();
    
    schedules.forEach(schedule => {
      schedule.items.forEach(item => {
        categoriesSet.add(item.category);
      });
    });
    
    // Get user-defined categories
    const userCategories = await Category.find({
      user: req.user.id,
      type: 'schedule'
    });
    
    userCategories.forEach(category => {
      categoriesSet.add(category.name);
    });
    
    const categories = Array.from(categoriesSet);
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    handleError(res, error, "Error getting schedule categories");
  }
};

// @desc    Create a schedule template
// @route   POST /api/schedules/templates
// @access  Private
exports.createTemplate = async (req, res) => {
  try {
    const { name, dayType, description, items, isDefault } = req.body;
    
    // Validate required fields
    if (!name || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Name and at least one item are required"
      });
    }
    
    // Check for duplicate template name
    const existingTemplate = await ScheduleTemplate.findOne({
      user: req.user.id,
      name: name.trim()
    });
    
    if (existingTemplate) {
      return res.status(400).json({
        success: false,
        message: "Template with this name already exists"
      });
    }
    
    // Create template
    const template = new ScheduleTemplate({
      user: req.user.id,
      name: name.trim(),
      dayType: dayType || "Any",
      description,
      items,
      isDefault: isDefault || false
    });
    
    await template.save();
    
    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    handleError(res, error, "Error creating schedule template");
  }
};

// @desc    Get all schedule templates for the user
// @route   GET /api/schedules/templates
// @access  Private
exports.getTemplates = async (req, res) => {
  try {
    const templates = await ScheduleTemplate.find({
      user: req.user.id
    });
    
    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    handleError(res, error, "Error getting schedule templates");
  }
};

// @desc    Get a single schedule template
// @route   GET /api/schedules/templates/:id
// @access  Private
exports.getTemplate = async (req, res) => {
  try {
    // Find template and verify ownership
    const template = await ScheduleTemplate.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found or not authorized"
      });
    }
    
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    handleError(res, error, "Error getting schedule template");
  }
};

// @desc    Update a schedule template
// @route   PUT /api/schedules/templates/:id
// @access  Private
exports.updateTemplate = async (req, res) => {
  try {
    // Find template and verify ownership
    const template = await ScheduleTemplate.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found or not authorized"
      });
    }
    
    const { name, dayType, description, items, isDefault } = req.body;
    
    // Check for duplicate template name if name is changed
    if (name && name !== template.name) {
      const existingTemplate = await ScheduleTemplate.findOne({
        user: req.user.id,
        name: name.trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingTemplate) {
        return res.status(400).json({
          success: false,
          message: "Template with this name already exists"
        });
      }
      
      template.name = name.trim();
    }
    
    // Update fields if provided
    if (dayType) template.dayType = dayType;
    if (description !== undefined) template.description = description;
    if (items) template.items = items;
    if (isDefault !== undefined) template.isDefault = isDefault;
    
    await template.save();
    
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    handleError(res, error, "Error updating schedule template");
  }
};

// @desc    Delete a schedule template
// @route   DELETE /api/schedules/templates/:id
// @access  Private
exports.deleteTemplate = async (req, res) => {
  try {
    // Find template and verify ownership
    const template = await ScheduleTemplate.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found or not authorized"
      });
    }
    
    await template.remove();
    
    res.json({
      success: true,
      message: "Template deleted successfully"
    });
  } catch (error) {
    handleError(res, error, "Error deleting schedule template");
  }
};

// server/controllers/skills.js
const Skill = require("../models/Skills");
const Category = require("../models/Category");

// Helper function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get all skills for the authenticated user
// @route   GET /api/skills
// @access  Private
exports.getSkills = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = { user: req.user.id };

    // Apply category filter if provided
    if (category) {
      query.category = category;
    }

    // Apply status filter if provided
    if (status) {
      query.status = status;
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });

    // Group skills by category for more organized response
    const groupedSkills = skills.reduce((acc, skill) => {
      // Create category group if it doesn't exist
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      // Add skill to its category group
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      count: skills.length,
      data: skills,
      groupedSkills,
    });
  } catch (error) {
    handleError(res, error, "Error retrieving skills");
  }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private
exports.addSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      status,
      progress,
      description,
      resources,
      priority,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({
      user: req.user.id,
      name: name.trim(),
      category,
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists in this category",
      });
    }

    // Create the skill
    const skill = new Skill({
      user: req.user.id,
      name: name.trim(),
      category,
      status: status || "upcoming",
      progress: progress || 0,
      description,
      resources,
      priority,
    });

    // Set start date if status is in-progress
    if (status === "in-progress" && !skill.startDate) {
      skill.startDate = new Date();
    }

    // Set completion date if status is completed
    if (status === "completed" && !skill.completionDate) {
      skill.completionDate = new Date();
      skill.progress = 100;
    }

    await skill.save();
    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    handleError(res, error, "Error adding skill");
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find skill and verify ownership
    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or not authorized",
      });
    }

    // Check for duplicate if name and category are being updated
    if (updates.name && updates.category) {
      const existingSkill = await Skill.findOne({
        user: req.user.id,
        name: updates.name.trim(),
        category: updates.category,
        _id: { $ne: id },
      });

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: "Skill already exists in this category",
        });
      }
    }

    // Handle status changes
    if (updates.status && updates.status !== skill.status) {
      // Set start date when moving to in-progress
      if (updates.status === "in-progress" && !skill.startDate) {
        updates.startDate = new Date();
      }

      // Set completion date when moving to completed
      if (updates.status === "completed" && !skill.completionDate) {
        updates.completionDate = new Date();
        updates.progress = 100;
      }

      // Clear completion date when moving from completed
      if (updates.status !== "completed" && skill.status === "completed") {
        updates.completionDate = null;
      }
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      // Make sure name is always trimmed
      if (key === "name" && updates.name) {
        skill[key] = updates[key].trim();
      } else {
        skill[key] = updates[key];
      }
    });

    await skill.save();

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    handleError(res, error, "Error updating skill");
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    // Find skill and verify ownership
    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or not authorized",
      });
    }

    await skill.deleteOne();

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting skill");
  }
};

// @desc    Get skill categories for the user
// @route   GET /api/skills/categories
// @access  Private
exports.getSkillCategories = async (req, res) => {
  try {
    // Get all unique categories used in skills by this user
    const usedCategories = await Skill.distinct("category", {
      user: req.user.id,
    });

    // Get all categories created by the user for skills
    const userCategories = await Category.find({
      user: req.user.id,
      type: "skills",
    });

    // Combine and deduplicate
    const allCategories = [
      ...new Set([...usedCategories, ...userCategories.map((cat) => cat.name)]),
    ];

    res.json({
      success: true,
      categories: allCategories,
    });
  } catch (error) {
    handleError(res, error, "Error getting skill categories");
  }
};

// @desc    Get skill statistics
// @route   GET /api/skills/stats
// @access  Private
exports.getSkillStats = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });

    if (skills.length === 0) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          upcoming: 0,
          completionRate: 0,
          averageProgress: 0,
          categoryCounts: {},
          statusDistribution: {
            completed: 0,
            inProgress: 0,
            upcoming: 0,
          },
        },
      });
    }

    // Calculate statistics
    const stats = {
      total: skills.length,
      completed: skills.filter((skill) => skill.status === "completed").length,
      inProgress: skills.filter((skill) => skill.status === "in-progress")
        .length,
      upcoming: skills.filter((skill) => skill.status === "upcoming").length,
    };

    // Calculate completion rate
    stats.completionRate = (stats.completed / stats.total) * 100;

    // Calculate average progress
    stats.averageProgress =
      skills.reduce((sum, skill) => sum + skill.progress, 0) / stats.total;

    // Count skills by category
    stats.categoryCounts = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});

    // Status distribution
    stats.statusDistribution = {
      completed: stats.completed,
      inProgress: stats.inProgress,
      upcoming: stats.upcoming,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    handleError(res, error, "Error getting skill statistics");
  }
};


// server/controllers/timetable.js (Previously activityTracker.js)
const Timetable = require("../models/Timetable");
const Category = require("../models/Category");

// Helper function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// Helper to set cache headers
const setCacheHeaders = (res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
};

// @desc    Get all timetables for the user
// @route   GET /api/timetables
// @access  Private
exports.getTimetables = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    const timetables = await Timetable.find({ user: req.user.id });
    
    res.json({
      success: true,
      count: timetables.length,
      data: timetables.map(timetable => ({
        id: timetable._id,
        name: timetable.name,
        description: timetable.description,
        isActive: timetable.isActive,
        createdAt: timetable.createdAt,
        updatedAt: timetable.updatedAt,
        activitiesCount: timetable.defaultActivities.length,
        completionRate: timetable.currentWeek.overallCompletionRate
      }))
    });
  } catch (error) {
    handleError(res, error, "Error getting timetables");
  }
};

// @desc    Create a new timetable
// @route   POST /api/timetables
// @access  Private
exports.createTimetable = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    const { name, description, defaultActivities } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }
    
    // Check if timetable with this name already exists
    const existingTimetable = await Timetable.findOne({
      user: req.user.id,
      name: name.trim()
    });
    
    if (existingTimetable) {
      return res.status(400).json({
        success: false,
        message: "A timetable with this name already exists"
      });
    }
    
    // Prepare default activities
    let activities = defaultActivities || [];
    
    // If no activities provided, use default ones
    if (!activities.length) {
      activities = [
        { name: "DS & Algo", time: "18:00-00:00", category: "Core" },
        { name: "MERN Stack", time: "00:00-05:00", category: "Frontend" },
        { name: "Go Backend", time: "10:00-12:00", category: "Backend" },
        { name: "Java & Spring", time: "12:00-14:00", category: "Backend" },
        { name: "Mobile Development", time: "14:00-17:00", category: "Mobile" },
      ];
    }
    
    // Create timetable
    const timetable = new Timetable({
      user: req.user.id,
      name: name.trim(),
      description,
      defaultActivities: activities
    });
    
    // Initialize the current week
    await timetable.startNewWeek();
    
    res.status(201).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    handleError(res, error, "Error creating timetable");
  }
};

// @desc    Get a specific timetable
// @route   GET /api/timetables/:id
// @access  Private
exports.getTimetable = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    handleError(res, error, "Error getting timetable");
  }
};

// @desc    Update a timetable
// @route   PUT /api/timetables/:id
// @access  Private
exports.updateTimetable = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    const { name, description, isActive } = req.body;
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    // Check for duplicate name
    if (name && name !== timetable.name) {
      const existingTimetable = await Timetable.findOne({
        user: req.user.id,
        name: name.trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingTimetable) {
        return res.status(400).json({
          success: false,
          message: "A timetable with this name already exists"
        });
      }
      
      timetable.name = name.trim();
    }
    
    if (description !== undefined) {
      timetable.description = description;
    }
    
    if (isActive !== undefined) {
      timetable.isActive = isActive;
      
      // If setting this as active, make all others inactive
      if (isActive) {
        await Timetable.updateMany(
          { user: req.user.id, _id: { $ne: req.params.id } },
          { isActive: false }
        );
      }
    }
    
    await timetable.save();
    
    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    handleError(res, error, "Error updating timetable");
  }
};

// @desc    Delete a timetable
// @route   DELETE /api/timetables/:id
// @access  Private
exports.deleteTimetable = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    // Prevent deleting the only timetable
    const count = await Timetable.countDocuments({ user: req.user.id });
    
    if (count <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the only timetable. Create another one first."
      });
    }
    
    // If deleting the active timetable, set another one as active
    if (timetable.isActive) {
      const anotherTimetable = await Timetable.findOne({
        user: req.user.id,
        _id: { $ne: req.params.id }
      });
      
      if (anotherTimetable) {
        anotherTimetable.isActive = true;
        await anotherTimetable.save();
      }
    }
    
    await timetable.remove();
    
    res.json({
      success: true,
      message: "Timetable deleted successfully"
    });
  } catch (error) {
    handleError(res, error, "Error deleting timetable");
  }
};

// @desc    Get current week for active timetable
// @route   GET /api/timetables/current-week
// @access  Private
exports.getCurrentWeek = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    // Find active timetable
    let timetable = await Timetable.findOne({
      user: req.user.id,
      isActive: true
    });
    
    // If no active timetable, use the first one
    if (!timetable) {
      timetable = await Timetable.findOne({ user: req.user.id });
      
      // If still no timetable, create a default one
      if (!timetable) {
        timetable = new Timetable({
          user: req.user.id,
          name: "Default Timetable",
          defaultActivities: [
            { name: "DS & Algo", time: "18:00-00:00", category: "Core" },
            { name: "MERN Stack", time: "00:00-05:00", category: "Frontend" },
            { name: "Go Backend", time: "10:00-12:00", category: "Backend" },
            { name: "Java & Spring", time: "12:00-14:00", category: "Backend" },
            { name: "Mobile Development", time: "14:00-17:00", category: "Mobile" },
          ]
        });
        await timetable.startNewWeek();
      }
      
      // Set as active
      timetable.isActive = true;
      await timetable.save();
    }
    
    const now = new Date();
    
    // Check if week has ended
    if (timetable.currentWeek && now > new Date(timetable.currentWeek.weekEndDate)) {
      console.log("Week has ended, starting new week");
      await timetable.startNewWeek();
      
      // Reload timetable to get fresh data
      timetable = await Timetable.findById(timetable._id);
    }
    
    res.json({
      success: true,
      timetableId: timetable._id,
      timetableName: timetable.name,
      data: timetable.currentWeek
    });
  } catch (error) {
    handleError(res, error, "Error getting current week");
  }
};

// @desc    Get history for a specific timetable
// @route   GET /api/timetables/:id/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    const { page = 1, limit = 10 } = req.query;
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    if (!timetable.history.length) {
      return res.json({
        success: true,
        history: [],
        currentPage: 1,
        totalPages: 0,
        totalWeeks: 0
      });
    }
    
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = parseInt(page) * parseInt(limit);
    const paginatedHistory = timetable.history.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      history: paginatedHistory,
      currentPage: parseInt(page),
      totalPages: Math.ceil(timetable.history.length / parseInt(limit)),
      totalWeeks: timetable.history.length,
    });
  } catch (error) {
    handleError(res, error, "Error getting history");
  }
};

// @desc    Toggle activity status
// @route   POST /api/timetables/:id/toggle
// @access  Private
exports.toggleActivityStatus = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    const { activityId, dayIndex } = req.body;
    
    if (dayIndex < 0 || dayIndex > 6) {
      return res.status(400).json({
        success: false,
        message: "Day index must be between 0 and 6"
      });
    }
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    // Find the activity
    const activity = timetable.currentWeek.activities.id(activityId);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }
    
    // Toggle status
    activity.dailyStatus[dayIndex] = !activity.dailyStatus[dayIndex];
    await timetable.save();
    
    res.json({
      success: true,
      data: timetable.currentWeek
    });
  } catch (error) {
    handleError(res, error, "Error toggling activity status");
  }
};

// @desc    Update default activities
// @route   PUT /api/timetables/:id/activities
// @access  Private
exports.updateDefaultActivities = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    // Input validation
    if (!Array.isArray(req.body.activities)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: activities must be an array"
      });
    }
    
    // Validate each activity
    for (const activity of req.body.activities) {
      if (!activity.name || !activity.time || !activity.category) {
        return res.status(400).json({
          success: false,
          message: "Each activity must have name, time, and category"
        });
      }
    }
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    // Update default activities
    timetable.defaultActivities = req.body.activities;
    
    // If there's a current week, update its activities while preserving statuses
    if (timetable.currentWeek && timetable.currentWeek.activities) {
      const currentActivities = timetable.currentWeek.activities;
      const newActivitiesMap = new Map(
        req.body.activities.map((activity, index) => [
          JSON.stringify({
            name: activity.name,
            time: activity.time,
            category: activity.category,
          }),
          index,
        ])
      );
      
      // Preserve status for matching activities, even if their order changes
      timetable.currentWeek.activities = req.body.activities.map(
        (newActivity, newIndex) => {
          // Find if this activity existed in the previous week
          const matchingPreviousActivity = currentActivities.find(
            (prevActivity) =>
              prevActivity.activity.name === newActivity.name &&
              prevActivity.activity.time === newActivity.time &&
              prevActivity.activity.category === newActivity.category
          );
          
          return {
            activity: newActivity,
            dailyStatus: matchingPreviousActivity
              ? matchingPreviousActivity.dailyStatus
              : [false, false, false, false, false, false, false],
            completionRate: matchingPreviousActivity
              ? matchingPreviousActivity.completionRate
              : 0,
          };
        }
      );
    }
    
    await timetable.save();
    
    res.json({
      success: true,
      data: {
        defaultActivities: timetable.defaultActivities,
        currentWeek: timetable.currentWeek
      }
    });
  } catch (error) {
    handleError(res, error, "Error updating activities");
  }
};

// @desc    Get timetable statistics
// @route   GET /api/timetables/:id/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    const stats = {
      currentWeek: {
        completionRate: timetable.currentWeek.overallCompletionRate,
        byCategory: {},
      },
      overall: {
        totalWeeks: timetable.history.length + 1,
        averageCompletionRate: 0,
        bestWeek: null,
        worstWeek: null,
      },
    };
    
    // Calculate category breakdown for current week
    timetable.currentWeek.activities.forEach((activity) => {
      const category = activity.activity.category;
      
      if (!stats.currentWeek.byCategory[category]) {
        stats.currentWeek.byCategory[category] = {
          total: 0,
          completed: 0,
        };
      }
      
      stats.currentWeek.byCategory[category].total += 7;
      stats.currentWeek.byCategory[category].completed +=
        activity.dailyStatus.filter((status) => status).length;
    });
    
    // Calculate completion rates for each category
    Object.keys(stats.currentWeek.byCategory).forEach((category) => {
      const categoryStats = stats.currentWeek.byCategory[category];
      categoryStats.completionRate =
        (categoryStats.completed / categoryStats.total) * 100;
    });
    
    // Calculate overall stats
    const allWeeks = [...timetable.history, timetable.currentWeek];
    
    if (allWeeks.length > 0) {
      stats.overall.averageCompletionRate =
        allWeeks.reduce((sum, week) => sum + week.overallCompletionRate, 0) /
        allWeeks.length;
      
      const sortedWeeks = [...allWeeks].sort(
        (a, b) => b.overallCompletionRate - a.overallCompletionRate
      );
      
      stats.overall.bestWeek = {
        weekStartDate: sortedWeeks[0].weekStartDate,
        completionRate: sortedWeeks[0].overallCompletionRate,
      };
      
      stats.overall.worstWeek = {
        weekStartDate: sortedWeeks[sortedWeeks.length - 1].weekStartDate,
        completionRate: sortedWeeks[sortedWeeks.length - 1].overallCompletionRate,
      };
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    handleError(res, error, "Error getting stats");
  }
};

// @desc    Force start a new week
// @route   POST /api/timetables/:id/new-week
// @access  Private
exports.startNewWeek = async (req, res) => {
  try {
    setCacheHeaders(res);
    
    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized"
      });
    }
    
    await timetable.startNewWeek();
    
    res.json({
      success: true,
      message: "New week started successfully",
      data: timetable.currentWeek
    });
  } catch (error) {
    handleError(res, error, "Error starting new week");
  }
};

// @desc    Get categories for timetables
// @route   GET /api/timetables/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    // Get all timetables for this user
    const timetables = await Timetable.find({ user: req.user.id });
    
    // Extract all unique categories
    const categoriesSet = new Set();
    
    timetables.forEach(timetable => {
      timetable.defaultActivities.forEach(activity => {
        categoriesSet.add(activity.category);
      });
    });
    
    // Get user-defined categories
    const userCategories = await Category.find({
      user: req.user.id,
      type: 'timetable'
    });
    
    userCategories.forEach(category => {
      categoriesSet.add(category.name);
    });
    
    const categories = Array.from(categoriesSet);
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    handleError(res, error, "Error getting categories");
  }
};

// server/controllers/workingHours.js
const WorkingHours = require("../models/WorkingHours");
const Category = require("../models/Category");

// Helper function to handle errors
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

exports.getWorkingHours = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let query = { user: req.user.id };

    // Date range filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    const workingHours = await WorkingHours.find(query)
      .sort({ date: -1 })
      .limit(30);

    // Calculate statistics
    const stats = {
      totalDays: workingHours.length,
      totalTargetHours: workingHours.reduce(
        (sum, day) => sum + day.targetHours,
        0
      ),
      totalAchievedHours: workingHours.reduce(
        (sum, day) => sum + day.achievedHours,
        0
      ),
      averageCompletion:
        workingHours.length > 0 
          ? workingHours.reduce((sum, day) => sum + day.progressPercentage, 0) / workingHours.length
          : 0,
      categoryBreakdown: workingHours.reduce((acc, day) => {
        acc[day.category] = (acc[day.category] || 0) + day.achievedHours;
        return acc;
      }, {}),
      moodDistribution: workingHours.reduce((acc, day) => {
        acc[day.mood] = (acc[day.mood] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json({ success: true, workingHours, stats });
  } catch (error) {
    handleError(res, error, "Error getting working hours");
  }
};

exports.addWorkingHours = async (req, res) => {
  try {
    const { date, targetHours, achievedHours, category, notes, mood } = req.body;

    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: "Category is required" 
      });
    }

    // Check if entry already exists for this date and user
    let existingEntry = await WorkingHours.findOne({
      user: req.user.id,
      date: new Date(date).setHours(0, 0, 0, 0),
    });

    if (existingEntry) {
      // Update existing entry
      existingEntry.targetHours = targetHours;
      existingEntry.achievedHours = achievedHours;
      existingEntry.category = category;
      existingEntry.notes = notes;
      existingEntry.mood = mood;
      await existingEntry.save();
      res.json({ success: true, data: existingEntry });
    } else {
      // Create new entry
      const workingHours = new WorkingHours({
        user: req.user.id,
        date,
        targetHours,
        achievedHours,
        category,
        notes,
        mood,
      });
      await workingHours.save();
      res.status(201).json({ success: true, data: workingHours });
    }
  } catch (error) {
    handleError(res, error, "Error adding working hours");
  }
};

exports.updateWorkingHours = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure user can't update the user field
    if (updates.user) {
      delete updates.user;
    }

    // Find the working hours entry and verify ownership
    const workingHours = await WorkingHours.findOne({
      _id: id,
      user: req.user.id
    });

    if (!workingHours) {
      return res.status(404).json({ 
        success: false, 
        message: "Working hours entry not found or not authorized" 
      });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      workingHours[key] = updates[key];
    });
    
    await workingHours.save();
    res.json({ success: true, data: workingHours });
  } catch (error) {
    handleError(res, error, "Error updating working hours");
  }
};

exports.deleteWorkingHours = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and ensure user owns the record
    const workingHours = await WorkingHours.findOne({
      _id: id,
      user: req.user.id
    });

    if (!workingHours) {
      return res.status(404).json({ 
        success: false, 
        message: "Working hours entry not found or not authorized" 
      });
    }

    await workingHours.remove();
    res.json({ 
      success: true, 
      message: "Working hours entry deleted successfully" 
    });
  } catch (error) {
    handleError(res, error, "Error deleting working hours");
  }
};

exports.getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const workingHours = await WorkingHours.find(query);
    
    if (workingHours.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalDays: 0,
          totalTargetHours: 0,
          totalAchievedHours: 0,
          averageCompletion: 0,
          categoryBreakdown: {},
          moodDistribution: {}
        }
      });
    }

    const stats = {
      totalDays: workingHours.length,
      totalTargetHours: workingHours.reduce(
        (sum, day) => sum + day.targetHours,
        0
      ),
      totalAchievedHours: workingHours.reduce(
        (sum, day) => sum + day.achievedHours,
        0
      ),
      averageCompletion:
        workingHours.reduce((sum, day) => sum + day.progressPercentage, 0) /
        workingHours.length,
      categoryBreakdown: workingHours.reduce((acc, day) => {
        acc[day.category] = (acc[day.category] || 0) + day.achievedHours;
        return acc;
      }, {}),
      moodDistribution: workingHours.reduce((acc, day) => {
        acc[day.mood] = (acc[day.mood] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json({ success: true, stats });
  } catch (error) {
    handleError(res, error, "Error getting stats");
  }
};

// Get all categories for the user
exports.getCategories = async (req, res) => {
  try {
    // Find all unique categories used by this user
    const categories = await WorkingHours.distinct('category', { user: req.user.id });
    
    // Get all categories created by the user
    const userCategories = await Category.find({ 
      user: req.user.id,
      type: 'working-hours'
    });
    
    // Combine and deduplicate
    const allCategories = [...new Set([
      ...categories,
      ...userCategories.map(cat => cat.name)
    ])];
    
    res.json({ success: true, categories: allCategories });
  } catch (error) {
    handleError(res, error, "Error getting categories");
  }
};