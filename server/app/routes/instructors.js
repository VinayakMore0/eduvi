const express = require("express");
const router = express.Router();
const instructorModel = require("../models/Instructor");
const InstructorApplication = require("../models/InstructorApplication.js");

router.get("/", async (req, res) => {
  try {
    const instructors = await instructorModel.find({});
    res.json({ instructors });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await instructorModel.findById(id).populate("courses"); // make sure Instructor schema has courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.json({ instructor });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/apply", async (req, res) => {
  try {
    const { bio, experience, education, skills, motivation, sampleWork } =
      req.body;

    // Basic validation
    if (!bio || !experience || !education || !skills || !motivation) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Create and save application to DB
    const application = new InstructorApplication({
      bio,
      experience,
      education,
      skills,
      motivation,
      sampleWork,
    });

    await application.save();

    return res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.error("Instructor apply error:", error);
    return res
      .status(500)
      .json({ message: "Server error, could not submit application" });
  }
});

module.exports = router;
