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
    
    await stats.deleteOne();
    
    res.json({
      success: true,
      message: "Stats entry deleted successfully"
    });
  } catch (error) {
    handleError(res, error, "Error deleting LeetCode stats");
  }
};