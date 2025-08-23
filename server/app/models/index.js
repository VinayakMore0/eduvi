const User = require("./User");
const Course = require("./Course");
const Lesson = require("./Lesson");
const Enrollment = require("./Enrollment");
const Order = require("./Order");

// Legacy exports for backward compatibility
const userModel = User;
const creatorModel = User; // Creator is now a User with role 'instructor'
const courseModel = Course;
const courseContentModel = Lesson; // CourseContent is now Lesson
const purchaseModel = Order; // Purchase is now Order

module.exports = {
  // New model exports
  User,
  Course,
  Lesson,
  Enrollment,
  Order,

  // Legacy exports for backward compatibility
  userModel,
  creatorModel,
  courseModel,
  courseContentModel,
  purchaseModel,
};
