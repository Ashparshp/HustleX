// server/models/Timetable.js (Previously ActivityTracker.js)
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
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
    trim: true,
  },
});

const timetableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Default Timetable",
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
  // If Sunday (0), subtract 6 days to get to Monday
  // If any other day, subtract (currentDay - 1) to get to Monday
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  monday.setDate(now.getDate() - daysToSubtract);
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

  return this; // Return this instead of this.save() to let the controller handle saving
};

// Compound index for user and timetable name uniqueness
timetableSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);
