// server/controllers/schedule.js
const Schedule = require("../models/Schedule");
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

    res.json({
      success: true,
      count: schedules.length,
      data: schedules,
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
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized",
      });
    }

    res.json({
      success: true,
      data: schedule,
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
    const { date, items } = req.body;

    // Format date to remove time component
    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);

    // Check if schedule already exists for this date and user
    const existingSchedule = await Schedule.findOne({
      user: req.user.id,
      date: scheduleDate,
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Schedule already exists for this date",
      });
    }

    // Determine day type (Weekend or Weekday)
    const dayType = scheduleDate.getDay() % 6 === 0 ? "Weekend" : "Weekday";

    const schedule = new Schedule({
      user: req.user.id,
      date: scheduleDate,
      dayType,
      items: items || [],
    });

    await schedule.save();

    res.status(201).json({
      success: true,
      data: schedule,
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
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized",
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
      data: updatedSchedule,
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
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized",
      });
    }

    await schedule.remove();

    res.json({
      success: true,
      message: "Schedule deleted successfully",
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
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized",
      });
    }

    // Validate required fields
    const { title, startTime, endTime, category } = req.body;
    if (!title || !startTime || !endTime || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, start time, end time, and category are required",
      });
    }

    schedule.items.push(req.body);
    await schedule.save();

    res.json({
      success: true,
      data: schedule,
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
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized",
      });
    }

    const item = schedule.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Schedule item not found",
      });
    }

    // Update item fields
    Object.keys(req.body).forEach((key) => {
      item[key] = req.body[key];
    });

    await schedule.save();

    res.json({
      success: true,
      data: schedule,
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
      user: req.user.id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found or not authorized",
      });
    }

    // Remove the item
    schedule.items = schedule.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await schedule.save();

    res.json({
      success: true,
      data: schedule,
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

    schedules.forEach((schedule) => {
      schedule.items.forEach((item) => {
        categoriesSet.add(item.category);
      });
    });

    // Get user-defined categories
    const userCategories = await Category.find({
      user: req.user.id,
      type: "schedule",
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
    handleError(res, error, "Error getting schedule categories");
  }
};
