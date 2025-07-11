const mongoose = require("mongoose");
const Skill = require("../models/Skills");

const defaultSkills = [
  {
    category: "MERN Stack",
    name: "React",
    status: "in-progress",
  },
  {
    category: "MERN Stack",
    name: "Node.js",
    status: "completed",
  },
  {
    category: "Java & Ecosystem",
    name: "Spring Boot",
    status: "upcoming",
  },
  {
    category: "DevOps",
    name: "Docker",
    status: "in-progress",
  },
];

async function initDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://ashparsh:nVksHlUQaCLzVdfG@cluster0.bepaxx0.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Clear existing skills
    await Skill.deleteMany({});
    console.log("Cleared existing skills");

    // Insert default skills
    await Skill.insertMany(defaultSkills);
    console.log("Inserted default skills");

    console.log("Database initialization complete");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initDb();
