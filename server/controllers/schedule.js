const Schedule = require("../models/Schedule");
const Category = require("../models/Category");

const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

exports.getSchedules = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

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

exports.getSchedule = async (req, res) => {
  try {
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

exports.createSchedule = async (req, res) => {
  try {
    const { date, items } = req.body;

    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);

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

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

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

    const { date, items, dayType, status } = req.body;

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

    const updatedSchedule = await schedule.save();

    res.json({
      success: true,
      data: updatedSchedule,
    });
  } catch (error) {
    handleError(res, error, "Error updating schedule");
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
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

    await schedule.deleteOne();

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting schedule");
  }
};

exports.addScheduleItem = async (req, res) => {
  try {
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

exports.updateScheduleItem = async (req, res) => {
  try {
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

exports.deleteScheduleItem = async (req, res) => {
  try {
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

exports.getScheduleCategories = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id });

    const categoriesSet = new Set();

    schedules.forEach((schedule) => {
      schedule.items.forEach((item) => {
        categoriesSet.add(item.category);
      });
    });

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
