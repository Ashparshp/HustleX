// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email",
      ],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow empty phone number (since it's optional)
          if (!v) return true;
          // Simple validation - can be enhanced based on specific requirements
          return /^\d{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    phoneVerificationCode: String,
    phoneVerificationExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Check if password matches
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  // Create token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Set expiration (24 hours)
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

// Generate and set password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Create token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate SMS verification code
UserSchema.methods.getPhoneVerificationCode = function () {
  // Generate a 6-digit code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Store the code and set expiration (10 minutes)
  this.phoneVerificationCode = verificationCode;
  this.phoneVerificationExpire = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

module.exports = mongoose.model("User", UserSchema);

// server/models/Skills.js
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["upcoming", "in-progress", "completed"],
      default: "upcoming",
    },
    startDate: Date,
    completionDate: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      trim: true
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["course", "documentation", "tutorial", "video", "book", "other"],
          default: "other"
        }
      }
    ],
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium"
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate skills for the same user
skillSchema.index({ user: 1, name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Skill", skillSchema);

// server/models/Contest.js
const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
    },
    participated: {
      type: Boolean,
      default: false,
    },
    rank: {
      type: Number,
      default: null,
    },
    solved: {
      type: Number,
      default: null,
    },
    totalProblems: {
      type: Number,
      default: null
    },
    duration: {
      type: Number, // in minutes
      default: null
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);

// server/models/WorkingHours.js
const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    targetHours: {
      type: Number,
      required: true,
      default: 15,
    },
    achievedHours: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    mood: {
      type: String,
      enum: ["Productive", "Normal", "Distracted"],
      default: "Normal",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for progress percentage
workingHoursSchema.virtual("progressPercentage").get(function () {
  return (this.achievedHours / this.targetHours) * 100;
});

// Virtual for completion status
workingHoursSchema.virtual("status").get(function () {
  const percentage = this.progressPercentage;
  if (percentage >= 100) return "Completed";
  if (percentage >= 75) return "On Track";
  if (percentage >= 50) return "In Progress";
  return "Behind";
});

// Compound index to prevent duplicate entries for the same user and date
workingHoursSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("WorkingHours", workingHoursSchema);

// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['working-hours', 'skills', 'schedule', 'timetable', 'goals'],
    default: 'working-hours'
  },
  color: {
    type: String,
    default: '#3498db' // Default blue color
  },
  icon: {
    type: String,
    default: 'circle' // Default icon name
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate categories of the same type for a user
categorySchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

// server/models/Schedule.js
const mongoose = require("mongoose");

const scheduleItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true
  },
});

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true,
    },
    dayType: {
      type: String,
      enum: ["Weekday", "Weekend"],
      required: true,
    },
    items: [scheduleItemSchema],
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },
    overallCompletion: {
      type: Number,
      default: 0
    },
    templateName: {
      type: String, // If this schedule is based on a template
      trim: true
    }
  },
  { timestamps: true }
);

// Calculate total hours and completion rate before saving
scheduleSchema.pre("save", function (next) {
  let total = 0;
  let completedItems = 0;
  
  this.items.forEach((item) => {
    // Calculate hours
    const start = new Date(`2000-01-01T${item.startTime}`);
    const end = new Date(`2000-01-01T${item.endTime}`);
    total += (end - start) / (1000 * 60 * 60); // Convert to hours
    
    // Track completed items
    if (item.completed) {
      completedItems++;
    }
  });
  
  this.totalHours = total;
  
  // Calculate completion percentage
  if (this.items.length > 0) {
    this.overallCompletion = (completedItems / this.items.length) * 100;
    
    // Update status based on completion
    if (this.overallCompletion === 0) {
      this.status = "Planned";
    } else if (this.overallCompletion < 100) {
      this.status = "In Progress";
    } else {
      this.status = "Completed";
    }
  } else {
    this.overallCompletion = 0;
    this.status = "Planned";
  }
  
  next();
});

// Compound index to prevent duplicate schedules for the same user and date
scheduleSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);

// server/models/ScheduleTemplate.js
const mongoose = require("mongoose");

const templateItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  notes: {
    type: String,
    trim: true
  },
});

const scheduleTemplateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    dayType: {
      type: String,
      enum: ["Weekday", "Weekend", "Any"],
      default: "Any",
    },
    description: {
      type: String,
      trim: true
    },
    items: [templateItemSchema],
    totalHours: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Calculate total hours before saving
scheduleTemplateSchema.pre("save", function (next) {
  let total = 0;
  
  this.items.forEach((item) => {
    // Calculate hours
    const start = new Date(`2000-01-01T${item.startTime}`);
    const end = new Date(`2000-01-01T${item.endTime}`);
    total += (end - start) / (1000 * 60 * 60); // Convert to hours
  });
  
  this.totalHours = total;
  next();
});

// Compound index to prevent duplicate template names for the same user
scheduleTemplateSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("ScheduleTemplate", scheduleTemplateSchema);

// server/models/Timetable.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
});

const dailyProgressSchema = new mongoose.Schema({
  activity: {
    type: activitySchema,
    required: true,
  },
  dailyStatus: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false],
    validate: {
      validator: function (arr) {
        return arr.length === 7;
      },
      message: "Daily status must contain exactly 7 values",
    },
  },
  completionRate: {
    type: Number,
    default: 0,
  },
});

const weekSchema = new mongoose.Schema({
  weekStartDate: {
    type: Date,
    required: true,
  },
  weekEndDate: {
    type: Date,
    required: true,
  },
  activities: [dailyProgressSchema],
  overallCompletionRate: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true
  }
});

const timetableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Default Timetable'
    },
    description: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    currentWeek: {
      type: weekSchema,
      required: true,
    },
    history: [weekSchema],
    defaultActivities: [activitySchema],
  },
  { timestamps: true }
);

// Pre-save middleware to calculate completion rates
timetableSchema.pre("save", function (next) {
  // Current week calculations
  if (this.currentWeek && this.currentWeek.activities) {
    let totalPossible = this.currentWeek.activities.length * 7;
    let totalCompleted = 0;

    this.currentWeek.activities.forEach((activity) => {
      const completed = activity.dailyStatus.filter(Boolean).length;
      activity.completionRate = (completed / 7) * 100;
      totalCompleted += completed;
    });

    this.currentWeek.overallCompletionRate =
      totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  }

  // History calculations
  this.history.forEach((week) => {
    let totalPossible = week.activities.length * 7;
    let totalCompleted = 0;

    week.activities.forEach((activity) => {
      const completed = activity.dailyStatus.filter(Boolean).length;
      activity.completionRate = (completed / 7) * 100;
      totalCompleted += completed;
    });

    week.overallCompletionRate =
      totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  });

  next();
});

// Method to start a new week
timetableSchema.methods.startNewWeek = async function () {
  console.log("Starting new week...");

  // Move current week to history if it exists and has activities
  if (
    this.currentWeek &&
    this.currentWeek.activities &&
    this.currentWeek.activities.length > 0
  ) {
    console.log("Moving current week to history:", {
      startDate: this.currentWeek.weekStartDate,
      endDate: this.currentWeek.weekEndDate,
      activities: this.currentWeek.activities.length,
    });
    this.history.push(this.currentWeek);
  }

  // Calculate new week dates
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, etc.

  // Calculate Monday (start of week)
  const monday = new Date(now);
  if (currentDay === 0) {
    // If today is Sunday, go back 6 days to previous Monday
    monday.setDate(now.getDate() - 6);
  } else {
    // Otherwise, go back to Monday of current week
    monday.setDate(now.getDate() - (currentDay - 1));
  }
  monday.setHours(0, 0, 0, 0);

  // Calculate Sunday (end of week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  console.log("New week dates:", {
    monday: monday.toISOString(),
    sunday: sunday.toISOString(),
    now: now.toISOString(),
  });

  // Create new week with default activities
  this.currentWeek = {
    weekStartDate: monday,
    weekEndDate: sunday,
    activities: this.defaultActivities.map((activity) => ({
      activity: activity,
      dailyStatus: [false, false, false, false, false, false, false],
      completionRate: 0,
    })),
    overallCompletionRate: 0,
  };

  console.log(
    "New week created with activities:",
    this.currentWeek.activities.length
  );

  return this.save();
};

// Compound index for user and timetable name uniqueness
timetableSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);

// server/models/LeetCode.js
const mongoose = require("mongoose");

const leetCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
    },
    totalEasy: {
      type: Number,
      default: 0
    },
    totalMedium: {
      type: Number,
      default: 0
    },
    totalHard: {
      type: Number,
      default: 0
    },
    ranking: {
      type: Number,
    },
    username: {
      type: String,
      trim: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeetCode", leetCodeSchema);