// server/scripts/dataMigration.js
/**
 * Data Migration Script
 *
 * This script migrates existing data to the new multi-user structure.
 * It associates all existing data with a default admin user.
 *
 * Usage:
 * 1. Make sure MongoDB connection is configured in .env
 * 2. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in .env
 * 3. Run: node scripts/dataMigration.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const WorkingHours = require("../models/WorkingHours");
const Skill = require("../models/Skills");
const Schedule = require("../models/Schedule");
// Import the model with its current name - your original file is likely called ActivityTracker
const ActivityTracker = mongoose.model("ActivityTracker") || {
  schema: mongoose.Schema({}),
};
const Timetable = require("../models/Timetable"); // New model
const Category = require("../models/Category");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Migration function
const migrateData = async () => {
  try {
    console.log("Starting data migration...");

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      salt
    );

    // Check if admin user already exists
    let adminUser = await User.findOne({
      email: process.env.ADMIN_EMAIL || "admin@example.com",
    });

    if (!adminUser) {
      adminUser = await User.create({
        name: process.env.ADMIN_NAME || "Admin User",
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: hashedPassword,
        isEmailVerified: true,
      });
      console.log(`Created admin user: ${adminUser.email}`);
    } else {
      console.log(`Using existing admin user: ${adminUser.email}`);
    }

    // Migrate categories first
    console.log("Migrating categories...");

    // Create default categories for each module type
    const categoryTypes = ["working-hours", "skills", "schedule", "timetable"];

    for (const type of categoryTypes) {
      let categories = [];

      // Get existing categories from each collection
      switch (type) {
        case "working-hours":
          const workingHours = await WorkingHours.find();
          categories = [
            ...new Set(workingHours.map((wh) => wh.category).filter(Boolean)),
          ];
          break;

        case "skills":
          const skills = await Skill.find();
          categories = [
            ...new Set(skills.map((skill) => skill.category).filter(Boolean)),
          ];
          break;

        case "schedule":
          const schedules = await Schedule.find();
          const scheduleCategories = new Set();
          schedules.forEach((schedule) => {
            if (schedule.items && Array.isArray(schedule.items)) {
              schedule.items.forEach((item) => {
                if (item && item.category)
                  scheduleCategories.add(item.category);
              });
            }
          });
          categories = [...scheduleCategories];
          break;

        case "timetable":
          try {
            // First, attempt to find ActivityTracker collection directly
            const activityTrackerCollection =
              mongoose.connection.db.collection("activitytrackers");
            if (activityTrackerCollection) {
              const activityDocs = await activityTrackerCollection
                .find({})
                .toArray();
              if (
                activityDocs.length > 0 &&
                activityDocs[0].defaultActivities
              ) {
                const actCategories = new Set();
                activityDocs[0].defaultActivities.forEach((act) => {
                  if (act && act.category) actCategories.add(act.category);
                });
                categories = [...actCategories];
              }
            }
          } catch (err) {
            console.log(
              "No ActivityTracker collection found, using default categories"
            );
            categories = ["Career", "Backend", "Core", "Frontend", "Mobile"];
          }
          break;
      }

      // Create category documents
      for (const name of categories) {
        if (!name) continue;

        // Check if category already exists
        const existingCategory = await Category.findOne({
          user: adminUser._id,
          name,
          type,
        });

        if (!existingCategory) {
          await Category.create({
            user: adminUser._id,
            name,
            type,
            color: getRandomColor(),
            icon: "circle",
          });
        }
      }

      console.log(`Created ${categories.length} categories for ${type}`);
    }

    // Migrate working hours
    console.log("Migrating working hours...");
    const workingHours = await WorkingHours.find();
    let whCount = 0;

    for (const wh of workingHours) {
      // Check if already migrated
      const existingWh = await WorkingHours.findOne({
        user: adminUser._id,
        date: wh.date,
      });

      if (!existingWh) {
        const newWh = new WorkingHours({
          ...wh.toObject(),
          _id: undefined, // Create new ID
          user: adminUser._id,
        });
        await newWh.save();
        whCount++;
      }
    }
    console.log(`Migrated ${whCount} working hours records`);

    // Migrate skills
    console.log("Migrating skills...");
    const skills = await Skill.find();
    let skillCount = 0;

    for (const skill of skills) {
      // Check if already migrated
      const existingSkill = await Skill.findOne({
        user: adminUser._id,
        name: skill.name,
        category: skill.category,
      });

      if (!existingSkill) {
        const newSkill = new Skill({
          ...skill.toObject(),
          _id: undefined, // Create new ID
          user: adminUser._id,
        });
        await newSkill.save();
        skillCount++;
      }
    }
    console.log(`Migrated ${skillCount} skills`);

    // Migrate schedules
    console.log("Migrating schedules...");
    const schedules = await Schedule.find();
    let scheduleCount = 0;

    for (const schedule of schedules) {
      // Check if already migrated
      const existingSchedule = await Schedule.findOne({
        user: adminUser._id,
        date: schedule.date,
      });

      if (!existingSchedule) {
        const newSchedule = new Schedule({
          ...schedule.toObject(),
          _id: undefined, // Create new ID
          user: adminUser._id,
        });
        await newSchedule.save();
        scheduleCount++;
      }
    }
    console.log(`Migrated ${scheduleCount} schedules`);

    // Migrate activity tracker to timetable
    console.log("Migrating activity tracker to timetable...");

    try {
      // Try to access the ActivityTracker collection directly
      const activityTrackerCollection =
        mongoose.connection.db.collection("activitytrackers");

      if (activityTrackerCollection) {
        const activityDocs = await activityTrackerCollection.find({}).toArray();

        if (activityDocs.length > 0) {
          // Check if already migrated
          const existingTimetable = await Timetable.findOne({
            user: adminUser._id,
            name: "Default Timetable",
          });

          if (!existingTimetable) {
            const activityDoc = activityDocs[0];

            const timetable = new Timetable({
              user: adminUser._id,
              name: "Default Timetable",
              description: "Migrated from previous data",
              isActive: true,
              currentWeek: {
                weekStartDate:
                  activityDoc.currentWeek?.weekStartDate || new Date(),
                weekEndDate:
                  activityDoc.currentWeek?.weekEndDate ||
                  new Date(new Date().setDate(new Date().getDate() + 6)),
                activities: activityDoc.currentWeek?.activities || [],
                overallCompletionRate:
                  activityDoc.currentWeek?.overallCompletionRate || 0,
              },
              history: activityDoc.history || [],
              defaultActivities: activityDoc.defaultActivities || [],
            });

            await timetable.save();
            console.log("Migrated activity tracker to timetable");
          } else {
            console.log("Timetable already migrated, skipping");
          }
        } else {
          console.log("No activity tracker data found to migrate");
        }
      } else {
        console.log("No ActivityTracker collection found");
      }
    } catch (error) {
      console.log("Error migrating ActivityTracker:", error.message);

      // Create a default timetable if none exists
      const existingTimetable = await Timetable.findOne({
        user: adminUser._id,
      });

      if (!existingTimetable) {
        const now = new Date();
        const monday = new Date(now);
        // Go back to Monday of current week
        monday.setDate(
          now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)
        );
        monday.setHours(0, 0, 0, 0);

        // Calculate Sunday (end of week)
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const defaultActivities = [
          { name: "DS & Algo", time: "18:00-00:00", category: "Core" },
          { name: "MERN Stack", time: "00:00-05:00", category: "Frontend" },
          { name: "Go Backend", time: "10:00-12:00", category: "Backend" },
          { name: "Java & Spring", time: "12:00-14:00", category: "Backend" },
          {
            name: "Mobile Development",
            time: "14:00-17:00",
            category: "Mobile",
          },
        ];

        const timetable = new Timetable({
          user: adminUser._id,
          name: "Default Timetable",
          description: "Default timetable",
          isActive: true,
          currentWeek: {
            weekStartDate: monday,
            weekEndDate: sunday,
            activities: defaultActivities.map((activity) => ({
              activity: activity,
              dailyStatus: [false, false, false, false, false, false, false],
              completionRate: 0,
            })),
            overallCompletionRate: 0,
          },
          history: [],
          defaultActivities,
        });

        await timetable.save();
        console.log("Created default timetable");
      }
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Helper function to generate random colors for categories
function getRandomColor() {
  const colors = [
    "#3498db", // Blue
    "#2ecc71", // Green
    "#e74c3c", // Red
    "#f39c12", // Orange
    "#9b59b6", // Purple
    "#1abc9c", // Teal
    "#e67e22", // Dark Orange
    "#95a5a6", // Gray
    "#34495e", // Dark Blue
    "#16a085", // Dark Green
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

// Run migration
migrateData();
