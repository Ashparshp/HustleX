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

// IMPORTANT: Static routes must come BEFORE parameter routes
// These routes must come before /:id routes to prevent conflict
router.get("/categories", getCategories);

// These routes need to be specifically defined with the ID parameter
router.get("/:id/current-week", getCurrentWeek);
router.get("/:id/history", getHistory);
router.post("/:id/toggle", toggleActivityStatus);
router.put("/:id/activities", updateDefaultActivities);
router.get("/:id/stats", getStats);
router.post("/:id/new-week", startNewWeek);

// Generic ID routes must come AFTER specific routes
router
  .route("/:id")
  .get(getTimetable)
  .put(updateTimetable)
  .delete(deleteTimetable);

module.exports = router;
