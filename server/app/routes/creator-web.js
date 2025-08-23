const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_CREATOR_PASSWORD, COOKIE_OPTIONS } = require("../../config");
const {
  creatorModel,
  courseModel,
  courseContentModel,
  purchaseModel,
  userModel,
} = require("../models");

// Middleware to check if creator is logged inp

const isCreatorAuthenticated = (req, res, next) => {
  const token = req.signedCookies.creatorToken;

  if (!token) {
    return res.redirect("/creator/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_CREATOR_PASSWORD);
    req.creatorId = decoded.id;
    next();
  } catch (error) {
    res.clearCookie("creatorToken");
    return res.redirect("/creator/login");
  }
};

// Middleware to check if creator is NOT logged in (for login/register pages)
const isCreatorNotAuthenticated = (req, res, next) => {
  const token = req.signedCookies.creatorToken;

  if (token) {
    try {
      jwt.verify(token, JWT_CREATOR_PASSWORD);
      return res.redirect("/creator/dashboard");
    } catch (error) {
      res.clearCookie("creatorToken");
    }
  }

  next();
};

// Creator login page
router.get("/login", isCreatorNotAuthenticated, (req, res) => {
  res.render("creator/login", {
    error: req.query.error || null,
  });
});

// Creator register page
router.get("/register", isCreatorNotAuthenticated, (req, res) => {
  res.render("creator/register", {
    error: req.query.error || null,
  });
});

// Process creator login
router.post("/login", isCreatorNotAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the creator by email
    const creator = await creatorModel.findOne({ email });

    if (!creator) {
      return res.render("creator/login", {
        error: "Invalid email or password",
      });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, creator.password);

    if (!passwordMatch) {
      return res.render("creator/login", {
        error: "Invalid email or password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: creator._id.toString(),
      },
      JWT_CREATOR_PASSWORD,
      { expiresIn: "7d" }
    );

    // Set the token in a cookie
    res.cookie("creatorToken", token, COOKIE_OPTIONS);

    // Redirect to dashboard
    res.redirect("/creator/dashboard");
  } catch (error) {
    console.error("Creator login error:", error);
    res.render("creator/login", {
      error: "An error occurred during login. Please try again.",
    });
  }
});

// Process creator registration
router.post("/register", isCreatorNotAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render("creator/register", {
        error: "Passwords do not match",
      });
    }

    // Validate password complexity
    const passwordRegex = {
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /[0-9]/,
      special: /[^A-Za-z0-9]/,
    };

    if (
      password.length < 8 ||
      !passwordRegex.uppercase.test(password) ||
      !passwordRegex.lowercase.test(password) ||
      !passwordRegex.number.test(password) ||
      !passwordRegex.special.test(password)
    ) {
      return res.render("creator/register", {
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // Check if creator already exists
    const existingCreator = await creatorModel.findOne({ email });
    if (existingCreator) {
      return res.render("creator/register", {
        error: "Creator with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the creator
    await creatorModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Redirect to login page
    res.redirect("/creator/login");
  } catch (error) {
    console.error("Creator registration error:", error);
    res.render("creator/register", {
      error: "An error occurred during registration. Please try again.",
    });
  }
});

// Creator logout
router.get("/logout", (req, res) => {
  res.clearCookie("creatorToken");
  res.redirect("/creator/login");
});

// Creator dashboard
router.get("/dashboard", isCreatorAuthenticated, async (req, res) => {
  try {
    const creator = await creatorModel
      .findById(req.creatorId)
      .select("-password");

    // Get statistics
    const courses = await courseModel.find({ creatorId: req.creatorId });
    const courseIds = courses.map((course) => course._id);

    const purchases = await purchaseModel.find({
      courseId: { $in: courseIds },
    });

    const totalSales = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Get unique student count
    const uniqueStudents = [
      ...new Set(purchases.map((p) => p.userId.toString())),
    ];

    // Get recent courses
    const recentCourses = await courseModel
      .find({ creatorId: req.creatorId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent purchases
    const recentPurchases = await purchaseModel
      .find({
        courseId: { $in: courseIds },
      })
      .sort({ purchaseDate: -1 })
      .limit(5);

    // Enhance purchase data with course and user info
    const enhancedPurchases = await Promise.all(
      recentPurchases.map(async (purchase) => {
        const course = await courseModel.findById(purchase.courseId);
        const user = await userModel.findById(purchase.userId);

        return {
          ...purchase.toObject(),
          courseTitle: course ? course.title : "Unknown Course",
          userEmail: user ? user.email : "Unknown User",
        };
      })
    );

    res.render("creator/dashboard", {
      title: "Dashboard",
      active: "dashboard",
      creator,
      stats: {
        totalCourses: courses.length,
        totalSales,
        totalStudents: uniqueStudents.length,
      },
      recentCourses,
      recentPurchases: enhancedPurchases,
    });
  } catch (error) {
    console.error("Error loading creator dashboard:", error);
    res.render("creator/dashboard", {
      title: "Dashboard",
      active: "dashboard",
      error: "Failed to load dashboard data",
      stats: { totalCourses: 0, totalSales: 0, totalStudents: 0 },
      recentCourses: [],
      recentPurchases: [],
    });
  }
});

// Creator profile
router.get("/profile", isCreatorAuthenticated, async (req, res) => {
  try {
    const creator = await creatorModel
      .findById(req.creatorId)
      .select("-password");

    // Get creator statistics
    const courses = await courseModel.find({ creatorId: req.creatorId });
    const publishedCourses = courses.filter(
      (course) => course.published
    ).length;
    const draftCourses = courses.length - publishedCourses;

    const courseIds = courses.map((course) => course._id);
    const purchases = await purchaseModel.find({
      courseId: { $in: courseIds },
    });

    const totalRevenue = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    res.render("creator/profile", {
      title: "Creator Profile",
      active: "profile",
      creator,
      stats: {
        totalCourses: courses.length,
        publishedCourses,
        draftCourses,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error loading creator profile:", error);
    res.render("creator/profile", {
      title: "Creator Profile",
      active: "profile",
      error: "Failed to load profile data",
      creator: { firstName: "", lastName: "", email: "" },
      stats: {
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalRevenue: 0,
      },
    });
  }
});

// Update creator profile
router.post("/profile", isCreatorAuthenticated, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Get the current creator
    const creator = await creatorModel.findById(req.creatorId);

    // Update basic info
    const updateData = {
      firstName: firstName || creator.firstName,
      lastName: lastName || creator.lastName,
    };

    // Handle password change if requested
    if (currentPassword && newPassword && confirmPassword) {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        return res.render("creator/profile", {
          title: "Creator Profile",
          active: "profile",
          error: "New passwords do not match",
          creator,
          stats: {
            totalCourses: 0,
            publishedCourses: 0,
            draftCourses: 0,
            totalRevenue: 0,
          },
        });
      }

      // Validate password complexity
      const passwordRegex = {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[^A-Za-z0-9]/,
      };

      if (
        newPassword.length < 8 ||
        !passwordRegex.uppercase.test(newPassword) ||
        !passwordRegex.lowercase.test(newPassword) ||
        !passwordRegex.number.test(newPassword) ||
        !passwordRegex.special.test(newPassword)
      ) {
        return res.render("creator/profile", {
          title: "Creator Profile",
          active: "profile",
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
          creator,
          stats: {
            totalCourses: 0,
            publishedCourses: 0,
            draftCourses: 0,
            totalRevenue: 0,
          },
        });
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        creator.password
      );
      if (!passwordMatch) {
        return res.render("creator/profile", {
          title: "Creator Profile",
          active: "profile",
          error: "Current password is incorrect",
          creator,
          stats: {
            totalCourses: 0,
            publishedCourses: 0,
            draftCourses: 0,
            totalRevenue: 0,
          },
        });
      }

      // Hash the new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update the creator
    const updatedCreator = await creatorModel
      .findByIdAndUpdate(req.creatorId, updateData, { new: true })
      .select("-password");

    // Get creator statistics again
    const courses = await courseModel.find({ creatorId: req.creatorId });
    const publishedCourses = courses.filter(
      (course) => course.published
    ).length;
    const draftCourses = courses.length - publishedCourses;

    const courseIds = courses.map((course) => course._id);
    const purchases = await purchaseModel.find({
      courseId: { $in: courseIds },
    });

    const totalRevenue = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    res.render("creator/profile", {
      title: "Creator Profile",
      active: "profile",
      creator: updatedCreator,
      successMessage: "Profile updated successfully",
      stats: {
        totalCourses: courses.length,
        publishedCourses,
        draftCourses,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error updating creator profile:", error);

    const creator = await creatorModel
      .findById(req.creatorId)
      .select("-password");

    res.render("creator/profile", {
      title: "Creator Profile",
      active: "profile",
      error: "Failed to update profile",
      creator: creator || { firstName: "", lastName: "", email: "" },
      stats: {
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalRevenue: 0,
      },
    });
  }
});

// List all courses
router.get("/courses", isCreatorAuthenticated, async (req, res) => {
  try {
    const courses = await courseModel
      .find({ creatorId: req.creatorId })
      .sort({ createdAt: -1 });

    res.render("creator/courses", {
      title: "Manage Courses",
      active: "courses",
      courses,
    });
  } catch (error) {
    console.error("Error loading courses:", error);
    res.render("creator/courses", {
      title: "Manage Courses",
      active: "courses",
      error: "Failed to load courses",
      courses: [],
    });
  }
});

// Create course form
router.get("/courses/create", isCreatorAuthenticated, (req, res) => {
  res.render("creator/create-course", {
    title: "Create New Course",
    active: "create-course",
  });
});

// Process course creation
router.post("/courses/create", isCreatorAuthenticated, async (req, res) => {
  try {
    const { title, description, price, imageUrl, published } = req.body;

    // Create the course
    const newCourse = await courseModel.create({
      title,
      description,
      price: parseFloat(price),
      imageUrl,
      creatorId: req.creatorId,
      published: !!published,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.redirect(`/creator/courses/${newCourse._id}`);
  } catch (error) {
    console.error("Error creating course:", error);
    res.render("creator/create-course", {
      title: "Create New Course",
      active: "create-course",
      error: "Failed to create course",
    });
  }
});

// View course details
router.get("/courses/:courseId", isCreatorAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get the course
    const course = await courseModel.findOne({
      _id: courseId,
      creatorId: req.creatorId,
    });

    if (!course) {
      return res.status(404).render("creator/error", {
        title: "Not Found",
        message: "Course not found",
        error: { status: 404 },
      });
    }

    // Get course content
    const content = await courseContentModel.find({ courseId }).sort("order");

    // Get purchase statistics
    const purchases = await purchaseModel.find({ courseId });
    const totalRevenue = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    res.render("creator/view-course", {
      title: course.title,
      active: "courses",
      course,
      content,
      stats: {
        totalPurchases: purchases.length,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error viewing course:", error);
    res.render("creator/error", {
      title: "Error",
      message: "Failed to load course",
      error: { status: 500 },
    });
  }
});

// Edit course form
router.get(
  "/courses/:courseId/edit",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      // Get the course
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      res.render("creator/edit-course", {
        title: `Edit: ${course.title}`,
        active: "courses",
        course,
      });
    } catch (error) {
      console.error("Error loading course edit form:", error);
      res.render("creator/error", {
        title: "Error",
        message: "Failed to load course",
        error: { status: 500 },
      });
    }
  }
);

// Process course update
router.post(
  "/courses/:courseId/edit",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, price, imageUrl, published } = req.body;

      // Check if course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      // Update the course
      const updatedCourse = await courseModel.findByIdAndUpdate(
        courseId,
        {
          title,
          description,
          price: parseFloat(price),
          imageUrl,
          published: !!published,
          updatedAt: new Date(),
        },
        { new: true }
      );

      res.redirect(`/creator/courses/${courseId}`);
    } catch (error) {
      console.error("Error updating course:", error);

      const course = await courseModel.findById(req.params.courseId);

      res.render("creator/edit-course", {
        title: `Edit: ${course ? course.title : "Course"}`,
        active: "courses",
        error: "Failed to update course",
        course: course || {},
      });
    }
  }
);

// Delete course
router.post(
  "/courses/:courseId/delete",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      // Check if course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      // Delete course content
      await courseContentModel.deleteMany({ courseId });

      // Delete the course
      await courseModel.findByIdAndDelete(courseId);

      res.redirect("/creator/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      res.redirect(`/creator/courses?error=Failed to delete course`);
    }
  }
);

// Manage course content
router.get(
  "/courses/:courseId/content",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      // Get the course
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      // Get course content
      const content = await courseContentModel.find({ courseId }).sort("order");

      res.render("creator/course-content", {
        title: `${course.title} - Content`,
        active: "courses",
        course,
        content,
      });
    } catch (error) {
      console.error("Error loading course content:", error);
      res.render("creator/error", {
        title: "Error",
        message: "Failed to load course content",
        error: { status: 500 },
      });
    }
  }
);

// Add course content
router.post(
  "/courses/:courseId/content",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, contentType, videoUrl, duration, order } =
        req.body;

      // Check if course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      // Create content
      await courseContentModel.create({
        title,
        description,
        contentType,
        videoUrl,
        duration: parseInt(duration),
        order: parseInt(order),
        courseId,
      });

      res.redirect(`/creator/courses/${courseId}/content`);
    } catch (error) {
      console.error("Error adding course content:", error);
      res.redirect(
        `/creator/courses/${req.params.courseId}/content?error=Failed to add content`
      );
    }
  }
);

// Update course content
router.post(
  "/courses/:courseId/content/:contentId",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId, contentId } = req.params;
      const { title, description, contentType, videoUrl, duration, order } =
        req.body;

      // Check if course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      // Check if content exists
      const content = await courseContentModel.findOne({
        _id: contentId,
        courseId,
      });

      if (!content) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Content not found",
          error: { status: 404 },
        });
      }

      // Update content
      await courseContentModel.findByIdAndUpdate(contentId, {
        title,
        description,
        contentType,
        videoUrl,
        duration: parseInt(duration),
        order: parseInt(order),
      });

      res.redirect(`/creator/courses/${courseId}/content`);
    } catch (error) {
      console.error("Error updating course content:", error);
      res.redirect(
        `/creator/courses/${req.params.courseId}/content?error=Failed to update content`
      );
    }
  }
);

// Delete course content
router.post(
  "/courses/:courseId/content/:contentId",
  isCreatorAuthenticated,
  async (req, res) => {
    try {
      const { courseId, contentId } = req.params;

      // Check if course exists and belongs to this creator
      const course = await courseModel.findOne({
        _id: courseId,
        creatorId: req.creatorId,
      });

      if (!course) {
        return res.status(404).render("creator/error", {
          title: "Not Found",
          message: "Course not found",
          error: { status: 404 },
        });
      }

      // Delete content
      await courseContentModel.findOneAndDelete({
        _id: contentId,
        courseId,
      });

      res.redirect(`/creator/courses/${courseId}/content`);
    } catch (error) {
      console.error("Error deleting course content:", error);
      res.redirect(
        `/creator/courses/${req.params.courseId}/content?error=Failed to delete content`
      );
    }
  }
);

module.exports = router;
