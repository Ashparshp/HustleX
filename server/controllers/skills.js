// server/controllers/skills.js
const Skill = require("../models/Skills");
const Category = require("../models/Category");

// Helper function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get all skills for the authenticated user
// @route   GET /api/skills
// @access  Private
exports.getSkills = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = { user: req.user.id };

    // Apply category filter if provided
    if (category) {
      query.category = category;
    }

    // Apply status filter if provided
    if (status) {
      query.status = status;
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });

    // Group skills by category for more organized response
    const groupedSkills = skills.reduce((acc, skill) => {
      // Create category group if it doesn't exist
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      // Add skill to its category group
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      count: skills.length,
      data: skills,
      groupedSkills,
    });
  } catch (error) {
    handleError(res, error, "Error retrieving skills");
  }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private
exports.addSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      status,
      progress,
      description,
      resources,
      priority,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({
      user: req.user.id,
      name: name.trim(),
      category,
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists in this category",
      });
    }

    // Create the skill
    const skill = new Skill({
      user: req.user.id,
      name: name.trim(),
      category,
      status: status || "upcoming",
      progress: progress || 0,
      description,
      resources,
      priority,
    });

    // Set start date if status is in-progress
    if (status === "in-progress" && !skill.startDate) {
      skill.startDate = new Date();
    }

    // Set completion date if status is completed
    if (status === "completed" && !skill.completionDate) {
      skill.completionDate = new Date();
      skill.progress = 100;
    }

    await skill.save();
    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    handleError(res, error, "Error adding skill");
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find skill and verify ownership
    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or not authorized",
      });
    }

    // Check for duplicate if name and category are being updated
    if (updates.name && updates.category) {
      const existingSkill = await Skill.findOne({
        user: req.user.id,
        name: updates.name.trim(),
        category: updates.category,
        _id: { $ne: id },
      });

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: "Skill already exists in this category",
        });
      }
    }

    // Handle status changes
    if (updates.status && updates.status !== skill.status) {
      // Set start date when moving to in-progress
      if (updates.status === "in-progress" && !skill.startDate) {
        updates.startDate = new Date();
      }

      // Set completion date when moving to completed
      if (updates.status === "completed" && !skill.completionDate) {
        updates.completionDate = new Date();
        updates.progress = 100;
      }

      // Clear completion date when moving from completed
      if (updates.status !== "completed" && skill.status === "completed") {
        updates.completionDate = null;
      }
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      // Make sure name is always trimmed
      if (key === "name" && updates.name) {
        skill[key] = updates[key].trim();
      } else {
        skill[key] = updates[key];
      }
    });

    await skill.save();

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    handleError(res, error, "Error updating skill");
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    // Find skill and verify ownership
    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found or not authorized",
      });
    }

    await skill.deleteOne();

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting skill");
  }
};

// @desc    Get skill categories for the user
// @route   GET /api/skills/categories
// @access  Private
exports.getSkillCategories = async (req, res) => {
  try {
    // Get all unique categories used in skills by this user
    const usedCategories = await Skill.distinct("category", {
      user: req.user.id,
    });

    // Get all categories created by the user for skills
    const userCategories = await Category.find({
      user: req.user.id,
      type: "skills",
    });

    // Combine and deduplicate
    const allCategories = [
      ...new Set([...usedCategories, ...userCategories.map((cat) => cat.name)]),
    ];

    res.json({
      success: true,
      categories: allCategories,
    });
  } catch (error) {
    handleError(res, error, "Error getting skill categories");
  }
};

// @desc    Get skill statistics
// @route   GET /api/skills/stats
// @access  Private
exports.getSkillStats = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });

    if (skills.length === 0) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          upcoming: 0,
          completionRate: 0,
          averageProgress: 0,
          categoryCounts: {},
          statusDistribution: {
            completed: 0,
            inProgress: 0,
            upcoming: 0,
          },
        },
      });
    }

    // Calculate statistics
    const stats = {
      total: skills.length,
      completed: skills.filter((skill) => skill.status === "completed").length,
      inProgress: skills.filter((skill) => skill.status === "in-progress")
        .length,
      upcoming: skills.filter((skill) => skill.status === "upcoming").length,
    };

    // Calculate completion rate
    stats.completionRate = (stats.completed / stats.total) * 100;

    // Calculate average progress
    stats.averageProgress =
      skills.reduce((sum, skill) => sum + skill.progress, 0) / stats.total;

    // Count skills by category
    stats.categoryCounts = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});

    // Status distribution
    stats.statusDistribution = {
      completed: stats.completed,
      inProgress: stats.inProgress,
      upcoming: stats.upcoming,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    handleError(res, error, "Error getting skill statistics");
  }
};
