// server/routes/timetable.js (Previously activityTracker.js)
const express = require("express");
const router = express.Router();
const {
  getTimetables,
  createTimetable,
  getTimetable,
  updateTimetable,
  deleteTimetable,
  getCurrentWeek,
  getHistory,
  toggleActivityStatus,
  updateDefaultActivities,
  getStats,
  startNewWeek,
  getCategories,
} = require("../controllers/timetable");
const { protect } = require("../middleware/auth");

// Protect all routes
router.use(protect);

// Timetable management routes
router.route("/").get(getTimetables).post(createTimetable);

router
  .route("/:id")
  .get(getTimetable)
  .put(updateTimetable)
  .delete(deleteTimetable);

// Data access routes
router.get("/current-week", getCurrentWeek);
router.get("/categories", getCategories);

// Timetable-specific routes
router.get("/:id/history", getHistory);
router.post("/:id/toggle", toggleActivityStatus);
router.put("/:id/activities", updateDefaultActivities);
router.get("/:id/stats", getStats);
router.post("/:id/new-week", startNewWeek);

module.exports = router;
