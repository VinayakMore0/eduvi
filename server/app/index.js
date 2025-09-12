require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const passport = require("passport");
// require("./middleware/passport")(passport);
const path = require("path");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { creatorRouter } = require("./routes/creator");
const webRouter = require("./routes/web");
const creatorWebRouter = require("./routes/creator-web");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const contactRouter = require("./routes/contact");
const instructorsRoute = require("./routes/instructors");

const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
); // Enable CORS with credentials
app.use(morgan('dev')); // Request logging
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(cookieParser(process.env.COOKIE_SECRET)); // Parse cookies
// app.use(passport.initialize());

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

// Apply stricter rate limiting to authentication routes
app.use("/api/v1/user/signin", authLimiter);
app.use("/api/v1/user/signup", authLimiter);
app.use("/api/v1/creator/signin", authLimiter);
app.use("/api/v1/creator/signup", authLimiter);

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/creator", creatorRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/instructors", instructorsRoute);

// Web Routes (EJS)
app.use("/", webRouter);

// Creator Web Routes (EJS)
app.use("/creator", creatorWebRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    // API 404 response
    return res.status(404).json({
      message: "Route not found",
    });
  } else if (req.path.startsWith("/creator/")) {
    // Creator 404 response
    return res.status(404).render("creator/error", {
      title: "Not Found",
      message: "Page not found",
      error: { status: 404 },
    });
  }

  // Web 404 response
  res.status(404).render("pages/error", {
    title: "Not Found",
    message: "Page not found",
    error: { status: 404 },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (req.path.startsWith("/api/")) {
    // API error response
    return res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } else if (req.path.startsWith("/creator/")) {
    // Creator error response
    return res.status(500).render("creator/error", {
      title: "Error",
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err : {},
    });
  }

  // Web error response
  res.status(500).render("pages/error", {
    title: "Error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Database connection with retry logic
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
}

// Initialize database connection
connectDB();

module.exports = app;
