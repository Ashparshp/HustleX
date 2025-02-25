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
      data: timetables.map((timetable) => ({
        id: timetable._id,
        name: timetable.name,
        description: timetable.description,
        isActive: timetable.isActive,
        createdAt: timetable.createdAt,
        updatedAt: timetable.updatedAt,
        activitiesCount: timetable.defaultActivities.length,
        completionRate: timetable.currentWeek.overallCompletionRate,
      })),
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
        message: "Name is required",
      });
    }

    // Check if timetable with this name already exists
    const existingTimetable = await Timetable.findOne({
      user: req.user.id,
      name: name.trim(),
    });

    if (existingTimetable) {
      return res.status(400).json({
        success: false,
        message: "A timetable with this name already exists",
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
      defaultActivities: activities,
    });

    // Initialize the current week
    await timetable.startNewWeek();

    res.status(201).json({
      success: true,
      data: timetable,
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
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
      });
    }

    res.json({
      success: true,
      data: timetable,
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
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
      });
    }

    // Check for duplicate name
    if (name && name !== timetable.name) {
      const existingTimetable = await Timetable.findOne({
        user: req.user.id,
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (existingTimetable) {
        return res.status(400).json({
          success: false,
          message: "A timetable with this name already exists",
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
      data: timetable,
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
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
      });
    }

    // Prevent deleting the only timetable
    const count = await Timetable.countDocuments({ user: req.user.id });

    if (count <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the only timetable. Create another one first.",
      });
    }

    // If deleting the active timetable, set another one as active
    if (timetable.isActive) {
      const anotherTimetable = await Timetable.findOne({
        user: req.user.id,
        _id: { $ne: req.params.id },
      });

      if (anotherTimetable) {
        anotherTimetable.isActive = true;
        await anotherTimetable.save();
      }
    }

    await timetable.deleteOne();

    res.json({
      success: true,
      message: "Timetable deleted successfully",
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
      isActive: true,
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
            {
              name: "Mobile Development",
              time: "14:00-17:00",
              category: "Mobile",
            },
          ],
        });
        await timetable.startNewWeek();
      }

      // Set as active
      timetable.isActive = true;
      await timetable.save();
    }

    const now = new Date();

    // Check if week has ended
    if (
      timetable.currentWeek &&
      now > new Date(timetable.currentWeek.weekEndDate)
    ) {
      console.log("Week has ended, starting new week");
      await timetable.startNewWeek();

      // Reload timetable to get fresh data
      timetable = await Timetable.findById(timetable._id);
    }

    res.json({
      success: true,
      timetableId: timetable._id,
      timetableName: timetable.name,
      data: timetable.currentWeek,
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
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
      });
    }

    if (!timetable.history.length) {
      return res.json({
        success: true,
        history: [],
        currentPage: 1,
        totalPages: 0,
        totalWeeks: 0,
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
        message: "Day index must be between 0 and 6",
      });
    }

    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
      });
    }

    // Find the activity
    const activity = timetable.currentWeek.activities.id(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Toggle status
    activity.dailyStatus[dayIndex] = !activity.dailyStatus[dayIndex];
    await timetable.save();

    res.json({
      success: true,
      data: timetable.currentWeek,
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
        message: "Invalid input: activities must be an array",
      });
    }

    // Validate each activity
    for (const activity of req.body.activities) {
      if (!activity.name || !activity.time || !activity.category) {
        return res.status(400).json({
          success: false,
          message: "Each activity must have name, time, and category",
        });
      }
    }

    // Find timetable and verify ownership
    const timetable = await Timetable.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
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
        currentWeek: timetable.currentWeek,
      },
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
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
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
        completionRate:
          sortedWeeks[sortedWeeks.length - 1].overallCompletionRate,
      };
    }

    res.json({
      success: true,
      data: stats,
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
      user: req.user.id,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found or not authorized",
      });
    }

    await timetable.startNewWeek();

    res.json({
      success: true,
      message: "New week started successfully",
      data: timetable.currentWeek,
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

    timetables.forEach((timetable) => {
      timetable.defaultActivities.forEach((activity) => {
        categoriesSet.add(activity.category);
      });
    });

    // Get user-defined categories
    const userCategories = await Category.find({
      user: req.user.id,
      type: "timetable",
    });

    userCategories.forEach((category) => {
      categoriesSet.add(category.name);
    });

    const categories = Array.from(categoriesSet);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    handleError(res, error, "Error getting categories");
  }
};
