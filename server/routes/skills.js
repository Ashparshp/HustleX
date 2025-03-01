// server/routes/skills.js
const express = require("express");
const router = express.Router();
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillCategories,
  getSkillStats,
  reorderSkills
} = require("../controllers/skills");
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Main routes
router.route('/')
  .get(getSkills)
  .post(addSkill);

router.route('/:id')
  .put(updateSkill)
  .delete(deleteSkill);

// Additional routes
router.get('/categories', getSkillCategories);
router.get('/stats', getSkillStats);
router.post('/reorder', reorderSkills);

module.exports = router;