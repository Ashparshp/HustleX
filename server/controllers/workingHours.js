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

    await workingHours.deleteOne();
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