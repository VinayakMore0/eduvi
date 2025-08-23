const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { validateUserUpdate } = require("../middleware/validation");
const { apiLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting and authentication to all user routes
router.use(apiLimiter);
router.use(authenticate);

// User Profile Management
router.get("/profile", userController.getProfile);
router.put("/profile", validateUserUpdate, userController.updateProfile);
router.delete("/profile", userController.deleteProfile);

// User Enrollments
router.get("/enrollments", userController.getEnrollments);
router.get("/enrollments/:courseId", userController.getEnrollmentDetails);
router.put("/enrollments/:courseId/progress", userController.updateProgress);

// User Orders and Purchases
router.get("/orders", userController.getOrders);
router.get("/orders/:orderId", userController.getOrderDetails);

// User Learning Progress
router.get("/progress", userController.getLearningProgress);
router.post("/progress/lesson/:lessonId", userController.markLessonComplete);

// User Notes and Bookmarks
router.get("/notes", userController.getNotes);
router.post("/notes", userController.createNote);
router.put("/notes/:noteId", userController.updateNote);
router.delete("/notes/:noteId", userController.deleteNote);

router.get("/bookmarks", userController.getBookmarks);
router.post("/bookmarks", userController.createBookmark);
router.delete("/bookmarks/:bookmarkId", userController.deleteBookmark);

// User Preferences
router.get("/preferences", userController.getPreferences);
router.put("/preferences", userController.updatePreferences);

// User Dashboard Data
router.get("/dashboard", userController.getDashboard);

module.exports = router;
