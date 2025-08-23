const { User, Enrollment, Order } = require("../models");
const userService = require("../services/userService");

class UserController {
  // Get User Profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Update User Profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const user = await userService.updateUserProfile(userId, updates);

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update profile",
      });
    }
  }

  // Delete User Profile
  async deleteProfile(req, res) {
    try {
      const userId = req.user.id;

      await userService.deleteUserAccount(userId);

      res.clearCookie("userToken");
      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete account",
      });
    }
  }

  // Get User Enrollments
  async getEnrollments(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const enrollments = await userService.getUserEnrollments(userId, {
        status,
        page,
        limit,
      });

      res.json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      console.error("Get enrollments error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch enrollments",
      });
    }
  }

  // Get Enrollment Details
  async getEnrollmentDetails(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;

      const enrollment = await userService.getEnrollmentDetails(
        userId,
        courseId
      );

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      res.json({
        success: true,
        data: { enrollment },
      });
    } catch (error) {
      console.error("Get enrollment details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch enrollment details",
      });
    }
  }

  // Update Learning Progress
  async updateProgress(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const { lessonId, watchTime, completed } = req.body;

      const result = await userService.updateLearningProgress(
        userId,
        courseId,
        {
          lessonId,
          watchTime,
          completed,
        }
      );

      res.json({
        success: true,
        message: "Progress updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update progress",
      });
    }
  }

  // Get User Orders
  async getOrders(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const orders = await userService.getUserOrders(userId, {
        status,
        page,
        limit,
      });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  }

  // Get Order Details
  async getOrderDetails(req, res) {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;

      const order = await userService.getOrderDetails(userId, orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        data: { order },
      });
    } catch (error) {
      console.error("Get order details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order details",
      });
    }
  }

  // Get Learning Progress
  async getLearningProgress(req, res) {
    try {
      const userId = req.user.id;

      const progress = await userService.getLearningProgress(userId);

      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      console.error("Get learning progress error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch learning progress",
      });
    }
  }

  // Mark Lesson Complete
  async markLessonComplete(req, res) {
    try {
      const userId = req.user.id;
      const { lessonId } = req.params;
      const { watchTime, score } = req.body;

      const result = await userService.markLessonComplete(userId, lessonId, {
        watchTime,
        score,
      });

      res.json({
        success: true,
        message: "Lesson marked as complete",
        data: result,
      });
    } catch (error) {
      console.error("Mark lesson complete error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to mark lesson as complete",
      });
    }
  }

  // Get User Notes
  async getNotes(req, res) {
    try {
      const userId = req.user.id;
      const { courseId, lessonId } = req.query;

      const notes = await userService.getUserNotes(userId, {
        courseId,
        lessonId,
      });

      res.json({
        success: true,
        data: { notes },
      });
    } catch (error) {
      console.error("Get notes error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notes",
      });
    }
  }

  // Create Note
  async createNote(req, res) {
    try {
      const userId = req.user.id;
      const { lessonId, content, timestamp } = req.body;

      const note = await userService.createNote(userId, {
        lessonId,
        content,
        timestamp,
      });

      res.status(201).json({
        success: true,
        message: "Note created successfully",
        data: { note },
      });
    } catch (error) {
      console.error("Create note error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create note",
      });
    }
  }

  // Update Note
  async updateNote(req, res) {
    try {
      const userId = req.user.id;
      const { noteId } = req.params;
      const updates = req.body;

      const note = await userService.updateNote(userId, noteId, updates);

      res.json({
        success: true,
        message: "Note updated successfully",
        data: { note },
      });
    } catch (error) {
      console.error("Update note error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update note",
      });
    }
  }

  // Delete Note
  async deleteNote(req, res) {
    try {
      const userId = req.user.id;
      const { noteId } = req.params;

      await userService.deleteNote(userId, noteId);

      res.json({
        success: true,
        message: "Note deleted successfully",
      });
    } catch (error) {
      console.error("Delete note error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete note",
      });
    }
  }

  // Get User Bookmarks
  async getBookmarks(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.query;

      const bookmarks = await userService.getUserBookmarks(userId, {
        courseId,
      });

      res.json({
        success: true,
        data: { bookmarks },
      });
    } catch (error) {
      console.error("Get bookmarks error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookmarks",
      });
    }
  }

  // Create Bookmark
  async createBookmark(req, res) {
    try {
      const userId = req.user.id;
      const { lessonId, timestamp, title } = req.body;

      const bookmark = await userService.createBookmark(userId, {
        lessonId,
        timestamp,
        title,
      });

      res.status(201).json({
        success: true,
        message: "Bookmark created successfully",
        data: { bookmark },
      });
    } catch (error) {
      console.error("Create bookmark error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create bookmark",
      });
    }
  }

  // Delete Bookmark
  async deleteBookmark(req, res) {
    try {
      const userId = req.user.id;
      const { bookmarkId } = req.params;

      await userService.deleteBookmark(userId, bookmarkId);

      res.json({
        success: true,
        message: "Bookmark deleted successfully",
      });
    } catch (error) {
      console.error("Delete bookmark error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete bookmark",
      });
    }
  }

  // Get User Preferences
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("preferences");

      res.json({
        success: true,
        data: { preferences: user.preferences },
      });
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch preferences",
      });
    }
  }

  // Update User Preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { preferences } },
        { new: true, runValidators: true }
      ).select("preferences");

      res.json({
        success: true,
        message: "Preferences updated successfully",
        data: { preferences: user.preferences },
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(400).json({
        success: false,
        message: "Failed to update preferences",
      });
    }
  }

  // Get User Dashboard Data
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      const dashboardData = await userService.getDashboardData(userId);

      res.json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      console.error("Get dashboard error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data",
      });
    }
  }
}

module.exports = new UserController();
