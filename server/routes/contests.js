const express = require("express");
const router = express.Router();
const {
  getContests,
  addContest,
  updateContest,
  deleteContest,
  getPlatforms,
  getContestStats,
} = require("../controllers/contests");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getContests).post(addContest);

router.route("/:id").put(updateContest).delete(deleteContest);

router.get("/platforms", getPlatforms);
router.get("/stats", getContestStats);

module.exports = router;
