const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const checkCourseAccess = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // First check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.isPublished && course.instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Course is not available",
      });
    }

    // Check if user is enrolled or is the instructor
    if (course.instructor.toString() === userId) {
      req.isInstructor = true;
      req.course = course;
      return next();
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isActive: true,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
        requiresEnrollment: true,
      });
    }

    // Check if enrollment has expired (if applicable)
    if (enrollment.accessExpiresAt && new Date() > enrollment.accessExpiresAt) {
      return res.status(403).json({
        success: false,
        message: "Your access to this course has expired",
      });
    }

    req.enrollment = enrollment;
    req.course = course;
    next();
  } catch (error) {
    console.error("Course access check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify course access",
    });
  }
};

module.exports = { checkCourseAccess };
