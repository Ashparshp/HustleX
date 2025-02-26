// server/routes/schedule.js
const express = require("express");
const router = express.Router();
const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  addScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  getScheduleCategories,
} = require("../controllers/schedule");
const { protect } = require("../middleware/auth");

// Protect all routes
router.use(protect);

// Schedule routes
router.route("/").get(getSchedules).post(createSchedule);

router
  .route("/:id")
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

// Schedule item routes
router.route("/:id/items").post(addScheduleItem);

router
  .route("/:id/items/:itemId")
  .put(updateScheduleItem)
  .delete(deleteScheduleItem);

// Category routes
router.get("/categories", getScheduleCategories);

module.exports = router;
