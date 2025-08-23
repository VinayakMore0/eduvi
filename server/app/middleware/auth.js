const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_USER_PASSWORD } = require("../../config");

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.signedCookies.userToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deactivated",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Clear expired cookie
      res.clearCookie("userToken");
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Authorization middleware - check user roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Convert single role to array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.signedCookies.userToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        const user = await User.findById(decoded.id).select("-password");

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors for optional auth
        console.log("Optional auth token error:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next(); // Continue even if there's an error
  }
};

// Check if user owns resource
const checkOwnership = (
  resourceModel,
  resourceIdParam = "id",
  ownerField = "userId"
) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id;

      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check ownership
      const ownerId = resource[ownerField];
      if (ownerId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your own resources.",
        });
      }

      // Attach resource to request for use in controller
      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify resource ownership",
      });
    }
  };
};

// Check if user is enrolled in course
const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const { Enrollment } = require("../models");
    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to access this content",
      });
    }

    req.enrollment = enrollment;
    next();
  } catch (error) {
    console.error("Enrollment check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify course enrollment",
    });
  }
};

// Check if user is instructor of course
const checkInstructorAccess = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const { Course } = require("../models");
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructorId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only manage your own courses.",
      });
    }

    req.course = course;
    next();
  } catch (error) {
    console.error("Instructor access check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify instructor access",
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  checkOwnership,
  checkEnrollment,
  checkInstructorAccess,
};
