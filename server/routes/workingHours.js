const express = require("express");
const router = express.Router();
const {
  getWorkingHours,
  addWorkingHours,
  updateWorkingHours,
  deleteWorkingHours,
  getStats,
  getCategories,
} = require("../controllers/workingHours");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getWorkingHours).post(addWorkingHours);

router.route("/:id").put(updateWorkingHours).delete(deleteWorkingHours);

router.get("/stats", getStats);
router.get("/categories", getCategories);

module.exports = router;
