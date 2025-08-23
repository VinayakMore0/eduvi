const { Router } = require("express");
const mongoose = require("mongoose");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel, courseContentModel } = require("../models");
const courseRouter = Router();

// Purchase a course
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
    const courseId = req.body.courseId;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID format",
      });
    }

    // Check if course exists
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check if user already purchased this course
    const existingPurchase = await purchaseModel.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({
        message: "You have already purchased this course",
      });
    }

    // Create purchase record
    await purchaseModel.create({
      userId,
      courseId,
      amount: course.price,
    });

    res.status(201).json({
      message: "You have successfully purchased the course",
    });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get course by ID
courseRouter.get("/:id", async function (req, res) {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID format",
      });
    }

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get course content (only for purchased courses)
courseRouter.get("/:id/content", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID format",
      });
    }

    // Check if user has purchased the course
    const purchase = await purchaseModel.findOne({ userId, courseId });
    if (!purchase) {
      return res.status(403).json({
        message: "You need to purchase this course to access its content",
      });
    }

    // Get course content
    const content = await courseContentModel
      .find({ courseId })
      .sort({ order: 1 });

    res.json({
      content,
    });
  } catch (error) {
    console.error("Error fetching course content:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get all courses with pagination and filtering
courseRouter.get("/", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filters
    const filter = { published: true };

    if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }

    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const courses = await courseModel
      .find(filter)
      .select("title description price imageUrl createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await courseModel.countDocuments(filter);

    res.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = {
  courseRouter,
};
