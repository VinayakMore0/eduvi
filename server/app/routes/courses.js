const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateCourse, validateLesson } = require("../middleware/validation");
const { apiLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting to all course routes
router.use(apiLimiter);

// Public Course Routes (no authentication required)
router.get("/", courseController.getAllCourses);
router.get("/search", courseController.searchCourses);
router.get("/categories", courseController.getCategories);
router.get("/featured", courseController.getFeaturedCourses);
router.get("/:courseId", courseController.getCourseDetails);
router.get("/:courseId/preview", courseController.getCoursePreview);

// Course Enrollment (requires authentication)
router.post("/:courseId/enroll", authenticate, courseController.enrollInCourse);

// Course Content Access (requires authentication and enrollment)
router.get(
  "/:courseId/lessons",
  authenticate,
  courseController.getCourseLessons
);
router.get(
  "/:courseId/lessons/:lessonId",
  authenticate,
  courseController.getLessonContent
);

// Instructor Course Management (requires authentication and instructor role)
router.use(authenticate);
router.use(authorize(["instructor"]));

// Course CRUD Operations
router.post("/", validateCourse, courseController.createCourse);
router.put("/:courseId", validateCourse, courseController.updateCourse);
router.delete("/:courseId", courseController.deleteCourse);
router.post("/:courseId/publish", courseController.publishCourse);
router.post("/:courseId/unpublish", courseController.unpublishCourse);

// Lesson Management
router.post(
  "/:courseId/lessons",
  validateLesson,
  courseController.createLesson
);
router.put(
  "/:courseId/lessons/:lessonId",
  validateLesson,
  courseController.updateLesson
);
router.delete("/:courseId/lessons/:lessonId", courseController.deleteLesson);
router.put(
  "/:courseId/lessons/:lessonId/order",
  courseController.reorderLesson
);

// Course Analytics (instructor only)
router.get("/:courseId/analytics", courseController.getCourseAnalytics);
router.get("/:courseId/students", courseController.getCourseStudents);
router.get("/:courseId/reviews", courseController.getCourseReviews);

// Bulk Operations
router.post("/bulk/publish", courseController.bulkPublishCourses);
router.post("/bulk/unpublish", courseController.bulkUnpublishCourses);

module.exports = router;
