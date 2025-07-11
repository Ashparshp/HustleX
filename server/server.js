const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
require("dotenv").config();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(xss());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    serverTime: new Date(),
  });
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 10 minutes",
});
app.use("/api/auth", limiter);

app.use(hpp());

const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/working-hours", require("./routes/workingHours"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/contests", require("./routes/contests"));
app.use("/api/leetcode", require("./routes/leetcode"));
app.use("/api/schedules", require("./routes/schedule"));
app.use("/api/timetables", require("./routes/timetable"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    serverTime: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
