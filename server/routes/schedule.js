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

router.use(protect);

router.route("/").get(getSchedules).post(createSchedule);

router
  .route("/:id")
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

router.route("/:id/items").post(addScheduleItem);

router
  .route("/:id/items/:itemId")
  .put(updateScheduleItem)
  .delete(deleteScheduleItem);

router.get("/categories", getScheduleCategories);

module.exports = router;
