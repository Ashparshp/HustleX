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