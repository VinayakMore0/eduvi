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

module.exports = router;
