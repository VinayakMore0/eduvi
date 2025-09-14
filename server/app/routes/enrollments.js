// routes/enrollments.js - Updated for existing schema
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Enrollment = require("../models/Enrollment");

// Get user's enrollments
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'completed', 'active', etc.

    let query = { userId: userId };

    // Filter by status if provided
    if (status && status !== "all") {
      if (status === "completed") {
        query["completion.isCompleted"] = true;
      } else if (status === "in-progress") {
        query["completion.isCompleted"] = false;
        query["progress.progressPercentage"] = { $gt: 0 };
      } else if (status === "not-started") {
        query["completion.isCompleted"] = false;
        query["progress.progressPercentage"] = 0;
      } else {
        query.status = status;
      }
    }

    const enrollments = await Enrollment.find(query)
      .populate({
        path: "courseId",
        select:
          "title thumbnail instructor rating level duration lessons price category",
      })
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalEnrollments = await Enrollment.countDocuments(query);

    // Transform data to match expected format
    const transformedEnrollments = enrollments.map((enrollment) => ({
      _id: enrollment._id,
      course: {
        _id: enrollment.courseId._id,
        title: enrollment.courseId.title,
        thumbnail: enrollment.courseId.thumbnail,
        instructor: { name: enrollment.courseId.instructor }, // Adjusted for string instructor
        rating: enrollment.courseId.rating,
        level: enrollment.courseId.level,
        duration: enrollment.courseId.duration,
        totalLessons: enrollment.courseId.lessons,
        price: enrollment.courseId.price,
        category: enrollment.courseId.category,
      },
      progress: {
        completionPercentage: enrollment.progress.progressPercentage,
        lessonsCompleted: enrollment.progress.completedLessons,
        lastAccessedAt: enrollment.updatedAt,
        timeSpent: enrollment.progress.totalWatchTime,
      },
      isCompleted: enrollment.completion.isCompleted,
      completedAt: enrollment.completion.completedAt,
      enrolledAt: enrollment.enrollmentDate,
      status: enrollment.status,
    }));

    res.json({
      success: true,
      data: {
        enrollments: transformedEnrollments,
        pagination: {
          current: page,
          total: Math.ceil(totalEnrollments / limit),
          hasNext: skip + enrollments.length < totalEnrollments,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
});

// Check if user has access to a specific course
router.get("/check/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      userId: userId,
      courseId: courseId,
      status: "active",
    }).populate("courseId", "title price");

    const hasAccess = !!enrollment;

    res.json({
      success: true,
      data: {
        hasAccess,
        enrollment: hasAccess
          ? {
              id: enrollment._id,
              enrolledAt: enrollment.enrollmentDate,
              progress: enrollment.progress,
              isCompleted: enrollment.completion.isCompleted,
              completedAt: enrollment.completion.completedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Check course access error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check course access",
    });
  }
});

// Update course progress
router.put(
  "/:courseId/progress",
  [
    body("lessonId").notEmpty().withMessage("Lesson ID is required"),
    body("watchTime")
      .optional()
      .isNumeric()
      .withMessage("Watch time must be numeric"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { courseId } = req.params;
      const { lessonId, watchTime = 0, completed = true, score } = req.body;
      const userId = req.user.id;

      const enrollment = await Enrollment.findOne({
        userId: userId,
        courseId: courseId,
        status: "active",
      }).populate("courseId", "lessons");

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      // Update lesson progress
      const existingLessonIndex =
        enrollment.progress.completedLessons.findIndex(
          (lesson) => lesson.lessonId.toString() === lessonId
        );

      if (completed && existingLessonIndex === -1) {
        // Add new completed lesson
        enrollment.progress.completedLessons.push({
          lessonId: lessonId,
          completedAt: new Date(),
          watchTime: watchTime,
          score: score,
        });
      } else if (existingLessonIndex !== -1) {
        // Update existing lesson
        enrollment.progress.completedLessons[existingLessonIndex].watchTime =
          Math.max(
            enrollment.progress.completedLessons[existingLessonIndex]
              .watchTime || 0,
            watchTime
          );
        if (score !== undefined) {
          enrollment.progress.completedLessons[existingLessonIndex].score =
            score;
        }
      }

      // Update total watch time
      enrollment.progress.totalWatchTime += watchTime;

      // Update current lesson
      enrollment.progress.currentLesson = lessonId;

      // Calculate progress percentage
      const totalLessons = enrollment.courseId.lessons || 1;
      const completedLessonsCount = enrollment.progress.completedLessons.length;
      enrollment.progress.progressPercentage = Math.round(
        (completedLessonsCount / totalLessons) * 100
      );

      // Check if course is completed (80% threshold)
      if (
        enrollment.progress.progressPercentage >= 80 &&
        !enrollment.completion.isCompleted
      ) {
        enrollment.completion.isCompleted = true;
        enrollment.completion.completedAt = new Date();
        enrollment.status = "completed";

        // Calculate final score if applicable
        const scores = enrollment.progress.completedLessons
          .map((lesson) => lesson.score)
          .filter((score) => score !== undefined);

        if (scores.length > 0) {
          enrollment.completion.finalScore =
            scores.reduce((a, b) => a + b, 0) / scores.length;
        }
      }

      await enrollment.save();

      res.json({
        success: true,
        message: "Progress updated successfully",
        data: {
          progress: enrollment.progress,
          isCompleted: enrollment.completion.isCompleted,
          completedAt: enrollment.completion.completedAt,
        },
      });
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update progress",
      });
    }
  }
);

// Get course progress
router.get("/:courseId/progress", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      userId: userId,
      courseId: courseId,
      status: { $in: ["active", "completed"] },
    }).populate("courseId", "lessons title");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      data: {
        progress: enrollment.progress,
        completion: enrollment.completion,
        course: {
          totalLessons: enrollment.courseId.lessons,
          title: enrollment.courseId.title,
        },
      },
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
});

// Add note to lesson
router.post(
  "/:courseId/notes",
  [
    body("lessonId").notEmpty().withMessage("Lesson ID is required"),
    body("content").notEmpty().withMessage("Note content is required"),
    body("timestamp")
      .optional()
      .isNumeric()
      .withMessage("Timestamp must be numeric"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { courseId } = req.params;
      const { lessonId, content, timestamp = 0 } = req.body;
      const userId = req.user.id;

      const enrollment = await Enrollment.findOne({
        userId: userId,
        courseId: courseId,
        status: { $in: ["active", "completed"] },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      enrollment.notes.push({
        lessonId: lessonId,
        content: content,
        timestamp: timestamp,
        createdAt: new Date(),
      });

      await enrollment.save();

      res.json({
        success: true,
        message: "Note added successfully",
        data: {
          note: enrollment.notes[enrollment.notes.length - 1],
        },
      });
    } catch (error) {
      console.error("Add note error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add note",
      });
    }
  }
);

// Add bookmark
router.post(
  "/:courseId/bookmarks",
  [
    body("lessonId").notEmpty().withMessage("Lesson ID is required"),
    body("timestamp").isNumeric().withMessage("Timestamp is required"),
    body("title").notEmpty().withMessage("Bookmark title is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { courseId } = req.params;
      const { lessonId, timestamp, title } = req.body;
      const userId = req.user.id;

      const enrollment = await Enrollment.findOne({
        userId: userId,
        courseId: courseId,
        status: { $in: ["active", "completed"] },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      enrollment.bookmarks.push({
        lessonId: lessonId,
        timestamp: timestamp,
        title: title,
        createdAt: new Date(),
      });

      await enrollment.save();

      res.json({
        success: true,
        message: "Bookmark added successfully",
        data: {
          bookmark: enrollment.bookmarks[enrollment.bookmarks.length - 1],
        },
      });
    } catch (error) {
      console.error("Add bookmark error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add bookmark",
      });
    }
  }
);

// Get user's learning dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const userId = req.user.id;

    // Get enrollment statistics
    const enrollmentStats = await Enrollment.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalEnrolled: { $sum: 1 },
          totalCompleted: {
            $sum: { $cond: ["$completion.isCompleted", 1, 0] },
          },
          totalInProgress: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$completion.isCompleted", false] },
                    { $gt: ["$progress.progressPercentage", 0] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalLearningTime: { $sum: "$progress.totalWatchTime" },
          averageProgress: { $avg: "$progress.progressPercentage" },
        },
      },
    ]);

    const stats = enrollmentStats[0] || {
      totalEnrolled: 0,
      totalCompleted: 0,
      totalInProgress: 0,
      totalLearningTime: 0,
      averageProgress: 0,
    };

    // Get recent activity
    const recentEnrollments = await Enrollment.find({
      userId: userId,
    })
      .populate("courseId", "title thumbnail")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          totalNotStarted:
            stats.totalEnrolled - stats.totalCompleted - stats.totalInProgress,
        },
        recentActivity: recentEnrollments.map((enrollment) => ({
          _id: enrollment._id,
          course: {
            _id: enrollment.courseId._id,
            title: enrollment.courseId.title,
            thumbnail: enrollment.courseId.thumbnail,
          },
          progress: enrollment.progress,
          lastAccessed: enrollment.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
});

module.exports = router;
