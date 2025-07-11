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

router.use(protect);


router.route("/").get(getTimetables).post(createTimetable);

router.get("/categories", getCategories);

router.get("/:id/current-week", getCurrentWeek);
router.get("/:id/history", getHistory);
router.post("/:id/toggle", toggleActivityStatus);
router.put("/:id/activities", updateDefaultActivities);
router.get("/:id/stats", getStats);
router.post("/:id/new-week", startNewWeek);

router
  .route("/:id")
  .get(getTimetable)
  .put(updateTimetable)
  .delete(deleteTimetable);

module.exports = router;
