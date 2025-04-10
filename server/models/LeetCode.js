const mongoose = require("mongoose");

const leetCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      default: 0,
    },
    totalMedium: {
      type: Number,
      default: 0,
    },
    totalHard: {
      type: Number,
      default: 0,
    },
    ranking: {
      type: Number,
    },
    username: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    solvedCategories: {
      type: Map,
      of: Number,
      default: {},
    },
    completionStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeetCode", leetCodeSchema);
