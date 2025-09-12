// Course controller functions can be moved here from routes
// This is a placeholder for future refactoring

const Course = require("../models/Course"); // Make sure this path is correct

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ data: courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add other controller functions as needed

module.exports = {
  getAllCourses,
  // ...other exports
};
