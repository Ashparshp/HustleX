// server/controllers/category.js
const Category = require("../models/Category");

// Handle errors
const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

// @desc    Get all categories for a specific type
// @route   GET /api/categories?type=working-hours
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    // Validate type
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Category type is required",
      });
    }

    const categories = await Category.find({
      user: req.user.id,
      type,
    }).sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    handleError(res, error, "Error getting categories");
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const { name, type, color, icon, description } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    // Check for duplicates
    const existingCategory = await Category.findOne({
      user: req.user.id,
      name: name.trim(),
      type,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Create new category
    const category = await Category.create({
      user: req.user.id,
      name: name.trim(),
      type,
      color,
      icon,
      description,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleError(res, error, "Error creating category");
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { name, color, icon, description } = req.body;

    // Find category and check ownership
    let category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or not authorized",
      });
    }

    // Check for duplicates if name is changed
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        user: req.user.id,
        name: name.trim(),
        type: category.type,
        _id: { $ne: category._id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description;

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    handleError(res, error, "Error updating category");
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    // Find category and check ownership
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or not authorized",
      });
    }

    // Use deleteOne() instead of remove()
    await category.deleteOne();
    // Alternatively: await Category.deleteOne({ _id: req.params.id, user: req.user.id });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting category");
  }
};

// @desc    Get predefined categories for a module
// @route   GET /api/categories/defaults/:type
// @access  Private
exports.getDefaultCategories = async (req, res) => {
  try {
    const { type } = req.params;

    let defaultCategories = [];

    // Different defaults based on module type
    switch (type) {
      case "working-hours":
        defaultCategories = [
          { name: "Coding", color: "#3498db", icon: "code" },
          { name: "Learning", color: "#2ecc71", icon: "book" },
          { name: "Project Work", color: "#e74c3c", icon: "briefcase" },
          { name: "Other", color: "#95a5a6", icon: "more-horizontal" },
        ];
        break;
      case "skills":
        defaultCategories = [
          { name: "MERN Stack", color: "#3498db", icon: "server" },
          { name: "Java & Ecosystem", color: "#e67e22", icon: "coffee" },
          { name: "DevOps", color: "#9b59b6", icon: "settings" },
          { name: "Data Science & ML", color: "#2ecc71", icon: "bar-chart-2" },
          { name: "Mobile Development", color: "#e74c3c", icon: "smartphone" },
          { name: "Go Backend", color: "#1abc9c", icon: "send" },
        ];
        break;
      case "schedule":
        defaultCategories = [
          { name: "DSA", color: "#3498db", icon: "code" },
          { name: "System Design", color: "#9b59b6", icon: "git-branch" },
          { name: "Development", color: "#2ecc71", icon: "code-sandbox" },
          { name: "Learning", color: "#f39c12", icon: "book-open" },
          { name: "Problem Solving", color: "#e74c3c", icon: "zap" },
          { name: "Other", color: "#95a5a6", icon: "more-horizontal" },
        ];
        break;
      case "timetable":
        defaultCategories = [
          { name: "Career", color: "#3498db", icon: "briefcase" },
          { name: "Backend", color: "#2ecc71", icon: "server" },
          { name: "Core", color: "#e74c3c", icon: "cpu" },
          { name: "Frontend", color: "#f39c12", icon: "layout" },
          { name: "Mobile", color: "#9b59b6", icon: "smartphone" },
        ];
        break;
      case "goals":
        defaultCategories = [
          { name: "LeetCode", color: "#f39c12", icon: "code" },
          { name: "CodeChef", color: "#3498db", icon: "hash" },
          { name: "CodeForces", color: "#e74c3c", icon: "activity" },
          { name: "HackerRank", color: "#2ecc71", icon: "terminal" },
        ];
        break;
      default:
        break;
    }

    res.json({
      success: true,
      data: defaultCategories,
    });
  } catch (error) {
    handleError(res, error, "Error getting default categories");
  }
};
