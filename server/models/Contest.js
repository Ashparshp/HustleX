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
      type: Number,
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