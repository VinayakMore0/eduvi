const { Router } = require("express");
const bcrypt = require("bcrypt");
const z = require("zod");
const mongoose = require("mongoose");
const {
  creatorModel,
  courseModel,
  courseContentModel,
  purchaseModel,
} = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../../config");
const { creatorMiddleware } = require("../middleware/creator");

const creatorRouter = Router();

// Course schema validation
const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().min(0),
  imageUrl: z.string().url(),
});

// Course content schema validation
const courseContentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  contentType: z.enum(["video", "article", "quiz"]).default("video"),
  duration: z.number().optional(),
  order: z.number().int().min(1),
});

creatorRouter.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z
      .string()
      .min(3)
      .max(100)
      .refine((val) => /[A-Z]/.test(val), {
        error: "Must include an uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        error: "Must include a lowercase letter",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        error: "Must include a special character",
      }),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
  });

  const parsedData = requiredBody.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsedData.error,
    });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await creatorModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({
      message: "Signup Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while signing up",
    });
  }
});

creatorRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    const creator = await creatorModel.findOne({
      email,
    });

    if (!creator) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, creator.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: creator._id.toString(),
        },
        JWT_ADMIN_PASSWORD
      );

      res.json({
        token: token,
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Error during signin",
    });
  }
});

creatorRouter.post("/course", creatorMiddleware, async function (req, res) {
  try {
    const creatorId = req.userId;

    const parsedData = courseSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error.format(),
      });
    }

    const { title, description, price, imageUrl } = parsedData.data;

    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: creatorId,
    });

    res.status(201).json({
      message: "Course created successfully",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

creatorRouter.put("/course/:id", creatorMiddleware, async function (req, res) {
  try {
    const creatorId = req.userId;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID format",
      });
    }

    const parsedData = courseSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error.format(),
      });
    }

    const { title, description, price, imageUrl } = parsedData.data;

    const course = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: creatorId,
      },
      {
        title,
        description,
        price,
        imageUrl,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found or you don't have permission to update it",
      });
    }

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

creatorRouter.get("/courses", creatorMiddleware, async function (req, res) {
  try {
    const creatorId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const courses = await courseModel
      .find({
        creatorId: creatorId,
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await courseModel.countDocuments({ creatorId: creatorId });

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

// Delete course endpoint
creatorRouter.delete(
  "/course/:id",
  creatorMiddleware,
  async function (req, res) {
    try {
      const creatorId = req.userId;
      const courseId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          message: "Invalid course ID format",
        });
      }

      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: creatorId,
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found or you don't have permission to delete it",
        });
      }

      // Check if anyone has purchased this course
      const purchases = await purchaseModel.findOne({ courseId });
      if (purchases) {
        return res.status(400).json({
          message: "Cannot delete course as it has been purchased by users",
        });
      }

      // Delete all course content first
      await courseContentModel.deleteMany({ courseId });

      // Then delete the course
      await courseModel.deleteOne({ _id: courseId });

      res.json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

// Add course content
creatorRouter.post(
  "/course/:id/content",
  creatorMiddleware,
  async function (req, res) {
    try {
      const creatorId = req.userId;
      const courseId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          message: "Invalid course ID format",
        });
      }

      // Verify course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: creatorId,
      });

      if (!course) {
        return res.status(404).json({
          message:
            "Course not found or you don't have permission to add content",
        });
      }

      const parsedData = courseContentSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: parsedData.error.format(),
        });
      }

      const contentData = {
        ...parsedData.data,
        courseId,
      };

      const content = await courseContentModel.create(contentData);

      res.status(201).json({
        message: "Course content added successfully",
        content,
      });
    } catch (error) {
      console.error("Error adding course content:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

// Update course content
creatorRouter.put(
  "/course/:courseId/content/:contentId",
  creatorMiddleware,
  async function (req, res) {
    try {
      const creatorId = req.userId;
      const { courseId, contentId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(contentId)
      ) {
        return res.status(400).json({
          message: "Invalid ID format",
        });
      }

      // Verify course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: creatorId,
      });

      if (!course) {
        return res.status(404).json({
          message:
            "Course not found or you don't have permission to update content",
        });
      }

      const parsedData = courseContentSchema.partial().safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: parsedData.error.format(),
        });
      }

      const content = await courseContentModel.findOneAndUpdate(
        { _id: contentId, courseId },
        parsedData.data,
        { new: true }
      );

      if (!content) {
        return res.status(404).json({
          message: "Content not found",
        });
      }

      res.json({
        message: "Course content updated successfully",
        content,
      });
    } catch (error) {
      console.error("Error updating course content:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

// Delete course content
creatorRouter.delete(
  "/course/:courseId/content/:contentId",
  creatorMiddleware,
  async function (req, res) {
    try {
      const creatorId = req.userId;
      const { courseId, contentId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(contentId)
      ) {
        return res.status(400).json({
          message: "Invalid ID format",
        });
      }

      // Verify course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: creatorId,
      });

      if (!course) {
        return res.status(404).json({
          message:
            "Course not found or you don't have permission to delete content",
        });
      }

      const result = await courseContentModel.deleteOne({
        _id: contentId,
        courseId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Content not found",
        });
      }

      res.json({
        message: "Course content deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course content:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

// Get all content for a course
creatorRouter.get(
  "/course/:id/content",
  creatorMiddleware,
  async function (req, res) {
    try {
      const creatorId = req.userId;
      const courseId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          message: "Invalid course ID format",
        });
      }

      // Verify course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: creatorId,
      });

      if (!course) {
        return res.status(404).json({
          message:
            "Course not found or you don't have permission to view content",
        });
      }

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
  }
);

module.exports = {
  creatorRouter,
};
