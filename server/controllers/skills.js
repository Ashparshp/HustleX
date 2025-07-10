const Skill = require("../models/Skills");
const Category = require("../models/Category");

const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

exports.getSkills = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = { user: req.user.id };

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    const skills = await Skill.find(query).sort({
      category: 1,
      orderIndex: 1,
      name: 1,
    });

    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
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
      orderIndex,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

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

    const highestOrderSkill = await Skill.findOne({
      user: req.user.id,
      category,
    }).sort({ orderIndex: -1 });

    const nextOrderIndex = highestOrderSkill
      ? highestOrderSkill.orderIndex + 1
      : 0;

    const skill = new Skill({
      user: req.user.id,
      name: name.trim(),
      category,
      status: status || "upcoming",
      progress: progress || 0,
      description,
      resources,
      priority,
      orderIndex: orderIndex !== undefined ? orderIndex : nextOrderIndex,
    });

    if (status === "in-progress" && !skill.startDate) {
      skill.startDate = new Date();
    }

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

exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

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

    if (
      updates.name &&
      updates.category &&
      (updates.name !== skill.name || updates.category !== skill.category)
    ) {
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

    if (updates.status && updates.status !== skill.status) {
      if (updates.status === "in-progress" && !skill.startDate) {
        updates.startDate = new Date();
      }

      if (updates.status === "completed" && !skill.completionDate) {
        updates.completionDate = new Date();
        updates.progress = 100;
      }

      if (updates.status !== "completed" && skill.status === "completed") {
        updates.completionDate = null;
      }
    }

    Object.keys(updates).forEach((key) => {
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

exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

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

    const category = skill.category;
    const orderIndex = skill.orderIndex;

    await skill.deleteOne();

    await Skill.updateMany(
      {
        user: req.user.id,
        category,
        orderIndex: { $gt: orderIndex },
      },
      { $inc: { orderIndex: -1 } }
    );

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting skill");
  }
};

exports.getSkillCategories = async (req, res) => {
  try {
    const usedCategories = await Skill.distinct("category", {
      user: req.user.id,
    });

    const userCategories = await Category.find({
      user: req.user.id,
      type: "skills",
    });

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

    const stats = {
      total: skills.length,
      completed: skills.filter((skill) => skill.status === "completed").length,
      inProgress: skills.filter((skill) => skill.status === "in-progress")
        .length,
      upcoming: skills.filter((skill) => skill.status === "upcoming").length,
    };

    stats.completionRate = (stats.completed / stats.total) * 100;

    stats.averageProgress =
      skills.reduce((sum, skill) => sum + skill.progress, 0) / stats.total;

    stats.categoryCounts = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});

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

exports.reorderSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skills array is required for reordering",
      });
    }

    const updatePromises = skills.map(async (skillData) => {
      const { id, orderIndex } = skillData;

      if (!id || typeof orderIndex !== "number") {
        throw new Error("Each skill must have id and orderIndex");
      }

      const skill = await Skill.findOne({
        _id: id,
        user: req.user.id,
      });

      if (!skill) {
        throw new Error(`Skill not found: ${id}`);
      }

      skill.orderIndex = orderIndex;
      return skill.save();
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Skills reordered successfully",
    });
  } catch (error) {
    handleError(res, error, "Error reordering skills");
  }
};
