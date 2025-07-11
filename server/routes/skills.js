const express = require("express");
const router = express.Router();
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillCategories,
  getSkillStats,
  reorderSkills,
} = require("../controllers/skills");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getSkills).post(addSkill);

router.route("/:id").put(updateSkill).delete(deleteSkill);

router.get("/categories", getSkillCategories);
router.get("/stats", getSkillStats);
router.post("/reorder", reorderSkills);

module.exports = router;
