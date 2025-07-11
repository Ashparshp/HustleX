const express = require("express");
const router = express.Router();
const {
  getLeetCodeStats,
  updateLeetCodeStats,
  getLeetCodeHistory,
  deleteLeetCodeStats,
} = require("../controllers/leetcode");
const { protect } = require("../middleware/auth");

router.use(protect);

// Routes
router.route("/stats").get(getLeetCodeStats).post(updateLeetCodeStats);

router.get("/history", getLeetCodeHistory);
router.delete("/stats/:id", deleteLeetCodeStats);

module.exports = router;
