const express = require("express");
const router = express.Router();
const instructorModel = require("../models/Instructor");

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

    // Normally you’d save to DB. For now, return success with submitted data
    const application = {
      bio,
      experience,
      education,
      skills,
      motivation,
      sampleWork,
      createdAt: new Date(),
    };

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
