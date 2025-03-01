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
    },
    orderIndex: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate skills for the same user
skillSchema.index({ user: 1, name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Skill", skillSchema);