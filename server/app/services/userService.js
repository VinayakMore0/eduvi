const { User, Enrollment, Order, Course, Lesson } = require("../models");

class UserService {
  // Update user profile
  async updateUserProfile(userId, updates) {
    const allowedUpdates = ["firstName", "lastName", "profile", "preferences"];
    const filteredUpdates = {};

    // Filter allowed updates
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Delete user account
  async deleteUserAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();

    // TODO: Handle cleanup of user data, enrollments, etc.
    return { success: true };
  }

  // Get user enrollments with pagination
  async getUserEnrollments(userId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate("courseId", "title description imageUrl price instructorId")
      .populate("courseId.instructorId", "firstName lastName")
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enrollment.countDocuments(query);

    return {
      enrollments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get enrollment details
  async getEnrollmentDetails(userId, courseId) {
    const enrollment = await Enrollment.findOne({ userId, courseId })
      .populate("courseId")
      .populate("progress.completedLessons.lessonId");

    return enrollment;
  }

  // Update learning progress
  async updateLearningProgress(userId, courseId, progressData) {
    const { lessonId, watchTime, completed } = progressData;

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    // Find existing lesson progress
    const existingProgress = enrollment.progress.completedLessons.find(
      (lesson) => lesson.lessonId.toString() === lessonId
    );

    if (existingProgress) {
      // Update existing progress
      existingProgress.watchTime = Math.max(
        existingProgress.watchTime || 0,
        watchTime || 0
      );
      if (completed) {
        existingProgress.completedAt = new Date();
      }
    } else if (completed) {
      // Add new completed lesson
      enrollment.progress.completedLessons.push({
        lessonId,
        completedAt: new Date(),
        watchTime: watchTime || 0,
      });
    }

    // Update total watch time
    enrollment.progress.totalWatchTime += watchTime || 0;

    // Calculate progress percentage
    const totalLessons = await Lesson.countDocuments({
      courseId,
      status: "published",
    });
    const completedLessons = enrollment.progress.completedLessons.length;
    enrollment.progress.progressPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    // Check if course is completed
    if (
      enrollment.progress.progressPercentage === 100 &&
      !enrollment.completion.isCompleted
    ) {
      enrollment.completion.isCompleted = true;
      enrollment.completion.completedAt = new Date();
      enrollment.status = "completed";
    }

    await enrollment.save();
    return enrollment;
  }

  // Get user orders
  async getUserOrders(userId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("items.courseId", "title imageUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get order details
  async getOrderDetails(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, userId }).populate(
      "items.courseId"
    );

    return order;
  }

  // Get learning progress summary
  async getLearningProgress(userId) {
    const enrollments = await Enrollment.find({
      userId,
      status: "active",
    }).populate("courseId", "title imageUrl");

    const progressSummary = {
      totalCourses: enrollments.length,
      completedCourses: enrollments.filter((e) => e.completion.isCompleted)
        .length,
      inProgressCourses: enrollments.filter(
        (e) => !e.completion.isCompleted && e.progress.progressPercentage > 0
      ).length,
      totalWatchTime: enrollments.reduce(
        (sum, e) => sum + (e.progress.totalWatchTime || 0),
        0
      ),
      averageProgress:
        enrollments.length > 0
          ? Math.round(
              enrollments.reduce(
                (sum, e) => sum + e.progress.progressPercentage,
                0
              ) / enrollments.length
            )
          : 0,
      recentActivity: enrollments
        .filter((e) => e.progress.completedLessons.length > 0)
        .map((e) => ({
          courseId: e.courseId._id,
          courseTitle: e.courseId.title,
          lastActivity: Math.max(
            ...e.progress.completedLessons.map((l) =>
              new Date(l.completedAt).getTime()
            )
          ),
          progress: e.progress.progressPercentage,
        }))
        .sort((a, b) => b.lastActivity - a.lastActivity)
        .slice(0, 5),
    };

    return progressSummary;
  }

  // Mark lesson as complete
  async markLessonComplete(userId, lessonId, data = {}) {
    const { watchTime, score } = data;

    // Find the lesson and its course
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      userId,
      courseId: lesson.courseId,
      status: "active",
    });

    if (!enrollment) {
      throw new Error("You must be enrolled in this course");
    }

    // Update progress
    return await this.updateLearningProgress(userId, lesson.courseId, {
      lessonId,
      watchTime,
      completed: true,
      score,
    });
  }

  // Get user notes
  async getUserNotes(userId, filters = {}) {
    const { courseId, lessonId } = filters;

    const enrollments = await Enrollment.find({ userId });
    let notes = [];

    enrollments.forEach((enrollment) => {
      if (!courseId || enrollment.courseId.toString() === courseId) {
        enrollment.notes.forEach((note) => {
          if (!lessonId || note.lessonId.toString() === lessonId) {
            notes.push({
              ...note.toObject(),
              courseId: enrollment.courseId,
            });
          }
        });
      }
    });

    return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Create note
  async createNote(userId, noteData) {
    const { lessonId, content, timestamp } = noteData;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const enrollment = await Enrollment.findOne({
      userId,
      courseId: lesson.courseId,
    });

    if (!enrollment) {
      throw new Error("You must be enrolled in this course");
    }

    const note = {
      lessonId,
      content,
      timestamp: timestamp || 0,
      createdAt: new Date(),
    };

    enrollment.notes.push(note);
    await enrollment.save();

    return note;
  }

  // Update note
  async updateNote(userId, noteId, updates) {
    const enrollment = await Enrollment.findOne({
      userId,
      "notes._id": noteId,
    });

    if (!enrollment) {
      throw new Error("Note not found");
    }

    const note = enrollment.notes.id(noteId);
    Object.assign(note, updates);

    await enrollment.save();
    return note;
  }

  // Delete note
  async deleteNote(userId, noteId) {
    const enrollment = await Enrollment.findOne({
      userId,
      "notes._id": noteId,
    });

    if (!enrollment) {
      throw new Error("Note not found");
    }

    enrollment.notes.id(noteId).remove();
    await enrollment.save();

    return { success: true };
  }

  // Get user bookmarks
  async getUserBookmarks(userId, filters = {}) {
    const { courseId } = filters;

    const enrollments = await Enrollment.find({ userId });
    let bookmarks = [];

    enrollments.forEach((enrollment) => {
      if (!courseId || enrollment.courseId.toString() === courseId) {
        enrollment.bookmarks.forEach((bookmark) => {
          bookmarks.push({
            ...bookmark.toObject(),
            courseId: enrollment.courseId,
          });
        });
      }
    });

    return bookmarks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Create bookmark
  async createBookmark(userId, bookmarkData) {
    const { lessonId, timestamp, title } = bookmarkData;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const enrollment = await Enrollment.findOne({
      userId,
      courseId: lesson.courseId,
    });

    if (!enrollment) {
      throw new Error("You must be enrolled in this course");
    }

    const bookmark = {
      lessonId,
      timestamp: timestamp || 0,
      title:
        title ||
        `Bookmark at ${Math.floor(timestamp / 60)}:${String(
          timestamp % 60
        ).padStart(2, "0")}`,
      createdAt: new Date(),
    };

    enrollment.bookmarks.push(bookmark);
    await enrollment.save();

    return bookmark;
  }

  // Delete bookmark
  async deleteBookmark(userId, bookmarkId) {
    const enrollment = await Enrollment.findOne({
      userId,
      "bookmarks._id": bookmarkId,
    });

    if (!enrollment) {
      throw new Error("Bookmark not found");
    }

    enrollment.bookmarks.id(bookmarkId).remove();
    await enrollment.save();

    return { success: true };
  }

  // Get dashboard data
  async getDashboardData(userId) {
    const [enrollments, orders, progressSummary] = await Promise.all([
      this.getUserEnrollments(userId, { limit: 5 }),
      this.getUserOrders(userId, { limit: 5 }),
      this.getLearningProgress(userId),
    ]);

    return {
      enrollments: enrollments.enrollments,
      recentOrders: orders.orders,
      progress: progressSummary,
      stats: {
        totalCourses: progressSummary.totalCourses,
        completedCourses: progressSummary.completedCourses,
        totalWatchTime: progressSummary.totalWatchTime,
        averageProgress: progressSummary.averageProgress,
      },
    };
  }
}

module.exports = new UserService();
