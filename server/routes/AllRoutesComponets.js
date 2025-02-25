// server/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  verifyEmail,
  verifyPhone,
  resendVerification,
  resendPhoneVerification
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetails);
router.put('/update-password', protect, updatePassword);
router.post('/verify-phone', protect, verifyPhone);
router.post('/resend-verification', protect, resendVerification);
router.post('/resend-phone-verification', protect, resendPhoneVerification);

module.exports = router;

// server/routes/category.js
const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getDefaultCategories
} = require('../controllers/category');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getCategories)
  .post(createCategory);

router.route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

router.get('/defaults/:type', getDefaultCategories);

module.exports = router;

// server/routes/contests.js
const express = require('express');
const router = express.Router();
const {
  getContests,
  addContest,
  updateContest,
  deleteContest,
  getPlatforms,
  getContestStats
} = require('../controllers/contests');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Main routes
router.route('/')
  .get(getContests)
  .post(addContest);

router.route('/:id')
  .put(updateContest)
  .delete(deleteContest);

// Additional routes
router.get('/platforms', getPlatforms);
router.get('/stats', getContestStats);

module.exports = router;

// server/routes/leetcode.js
const express = require("express");
const router = express.Router();
const {
  getLeetCodeStats,
  updateLeetCodeStats,
  getLeetCodeHistory,
  deleteLeetCodeStats
} = require("../controllers/leetcode");
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/stats')
  .get(getLeetCodeStats)
  .post(updateLeetCodeStats);

router.get('/history', getLeetCodeHistory);
router.delete('/stats/:id', deleteLeetCodeStats);

module.exports = router;

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
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
} = require("../controllers/schedule");
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Schedule routes
router.route('/')
  .get(getSchedules)
  .post(createSchedule);

router.route('/:id')
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

// Schedule item routes
router.route('/:id/items')
  .post(addScheduleItem);

router.route('/:id/items/:itemId')
  .put(updateScheduleItem)
  .delete(deleteScheduleItem);

// Category routes
router.get('/categories', getScheduleCategories);

// Template routes
router.route('/templates')
  .get(getTemplates)
  .post(createTemplate);

router.route('/templates/:id')
  .get(getTemplate)
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;

// server/routes/skills.js
const express = require("express");
const router = express.Router();
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillCategories,
  getSkillStats
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

module.exports = router;

// server/routes/timetable.js
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
  getCategories
} = require("../controllers/timetable");
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Timetable management routes
router.route('/')
  .get(getTimetables)
  .post(createTimetable);

router.route('/:id')
  .get(getTimetable)
  .put(updateTimetable)
  .delete(deleteTimetable);

// Data access routes
router.get('/current-week', getCurrentWeek);
router.get('/categories', getCategories);

// Timetable-specific routes
router.get('/:id/history', getHistory);
router.post('/:id/toggle', toggleActivityStatus);
router.put('/:id/activities', updateDefaultActivities);
router.get('/:id/stats', getStats);
router.post('/:id/new-week', startNewWeek);

module.exports = router;

// server/routes/workingHours.js
const express = require("express");
const router = express.Router();
const {
  getWorkingHours,
  addWorkingHours,
  updateWorkingHours,
  deleteWorkingHours,
  getStats,
  getCategories
} = require("../controllers/workingHours");
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getWorkingHours)
  .post(addWorkingHours);

router.route('/:id')
  .put(updateWorkingHours)
  .delete(deleteWorkingHours);

router.get('/stats', getStats);
router.get('/categories', getCategories);

module.exports = router;
