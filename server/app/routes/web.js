const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../../config");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  const token = req.signedCookies.userToken;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const jwt = require("jsonwebtoken");
    const { JWT_USER_PASSWORD } = require("../config");
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.clearCookie("userToken");
    return res.redirect("/login");
  }
};

// Middleware to check if user is NOT logged in (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  const token = req.signedCookies.userToken;

  if (token) {
    try {
      jwt.verify(token, JWT_USER_PASSWORD);
      return res.redirect("/");
    } catch (error) {
      res.clearCookie("userToken");
    }
  }

  next();
};

// Home page
router.get("/", async (req, res) => {
  try {
    // Check if user is logged in
    let user = null;
    const token = req.signedCookies.userToken;

    if (token) {
      try {
        const { JWT_USER_PASSWORD } = require("../config");
        const jwt = require("jsonwebtoken");
        const { userModel } = require("../db");

        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        if (decoded && decoded.id) {
          const userData = await userModel
            .findById(decoded.id)
            .select("-password");
          if (userData) {
            user = {
              isLoggedIn: true,
              id: userData._id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
            };
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        res.clearCookie("userToken");
      }
    }

    // This would normally fetch data from your API
    const featuredCourses = [];

    res.render("pages/home", {
      title: "Home",
      featuredCourses,
      user,
    });
  } catch (error) {
    console.error("Error fetching home page data:", error);
    res.render("pages/home", {
      title: "Home",
      featuredCourses: [],
      user: null,
    });
  }
});

// Login page
router.get("/login", isNotAuthenticated, (req, res) => {
  const registered = req.query.registered === "true";
  res.render("pages/login", {
    title: "Login",
    successMessage: registered
      ? "Registration successful! You can now log in."
      : null,
  });
});

// Register page
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("pages/register", { title: "Register" });
});

// Process login form
router.post("/login", isNotAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    // Instead of using fetch, directly authenticate the user
    try {
      // Get the user model and JWT configuration
      const { userModel } = require("../db");
      const { JWT_USER_PASSWORD, COOKIE_OPTIONS } = require("../config");
      const bcrypt = require("bcrypt");
      const jwt = require("jsonwebtoken");

      // Find the user by email
      const user = await userModel.findOne({ email });

      if (!user) {
        console.log("User not found:", email);
        return res.render("pages/login", {
          title: "Login",
          error: "Invalid email or password",
        });
      }

      // Check the password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log("Password mismatch for user:", email);
        return res.render("pages/login", {
          title: "Login",
          error: "Invalid email or password",
        });
      }

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user._id.toString(),
        },
        JWT_USER_PASSWORD,
        { expiresIn: "7d" }
      );

      console.log("Login successful for user:", email);

      // Set the token in a cookie
      res.cookie("userToken", token, COOKIE_OPTIONS);

      // Redirect to home page
      res.redirect("/");
    } catch (error) {
      console.error("Direct login error:", error);
      return res.render("pages/login", {
        title: "Login",
        error: `Login error: ${error.message}`,
      });
    }
  } catch (error) {
    console.error("Login error details:", error.message);
    console.error("Error stack:", error.stack);
    res.render("pages/login", {
      title: "Login",
      error: `Login error: ${error.message}`,
    });
  }
});

// Process registration form
router.post("/register", isNotAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    console.log("Registration attempt with fields:", Object.keys(req.body));

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.render("pages/register", {
        title: "Register",
        error: "Passwords do not match",
      });
    }

    // Instead of using fetch, let's directly call the user model
    try {
      // Validate the input using the same schema as the API
      const userSchema = require("zod").object({
        email: require("zod").string().min(3).max(100).email(),
        password: require("zod")
          .string()
          .min(8)
          .max(100)
          .refine((val) => /[A-Z]/.test(val), {
            message: "Must include an uppercase letter",
          })
          .refine((val) => /[a-z]/.test(val), {
            message: "Must include a lowercase letter",
          })
          .refine((val) => /[0-9]/.test(val), {
            message: "Must include a number",
          })
          .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: "Must include a special character",
          }),
        firstName: require("zod").string().min(2).max(100),
        lastName: require("zod").string().min(2).max(100),
      });

      const parsedData = userSchema.safeParse({
        email,
        password,
        firstName,
        lastName,
      });
      if (!parsedData.success) {
        console.log("Validation failed:", parsedData.error.format());

        let errorMessage = "Invalid input";
        const errors = parsedData.error.format();

        if (errors.email?._errors) {
          errorMessage = `Email: ${errors.email._errors.join(", ")}`;
        } else if (errors.password?._errors) {
          errorMessage = `Password: ${errors.password._errors.join(", ")}`;
        } else if (errors.firstName?._errors) {
          errorMessage = `First Name: ${errors.firstName._errors.join(", ")}`;
        } else if (errors.lastName?._errors) {
          errorMessage = `Last Name: ${errors.lastName._errors.join(", ")}`;
        }

        return res.render("pages/register", {
          title: "Register",
          error: errorMessage,
        });
      }

      // Check if user already exists
      const { userModel } = require("../db");
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.render("pages/register", {
          title: "Register",
          error: "User with this email already exists",
        });
      }

      // Hash the password
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      await userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Redirect to login page with success message
      res.redirect("/login?registered=true");
    } catch (error) {
      console.error("Direct registration error:", error);
      return res.render("pages/register", {
        title: "Register",
        error: `Registration error: ${error.message}`,
      });
    }
  } catch (error) {
    console.error("Registration error details:", error.message);
    console.error("Error stack:", error.stack);
    res.render("pages/register", {
      title: "Register",
      error: `Registration error: ${error.message}`,
    });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("userToken");
  res.redirect("/");
});

// Courses page
router.get("/courses", async (req, res) => {
  try {
    const { courseModel } = require("../db");

    // Get all published courses
    const courses = await courseModel.find({ published: true });

    // Check if user is logged in
    let user = null;
    const token = req.signedCookies.userToken;

    if (token) {
      try {
        const { JWT_USER_PASSWORD } = require("../config");
        const jwt = require("jsonwebtoken");
        const { userModel } = require("../db");

        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        if (decoded && decoded.id) {
          const userData = await userModel
            .findById(decoded.id)
            .select("-password");
          if (userData) {
            user = {
              isLoggedIn: true,
              id: userData._id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
            };
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }

    res.render("pages/courses", {
      title: "Courses",
      courses,
      user,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.render("pages/courses", {
      title: "Courses",
      error: "Failed to load courses",
      courses: [],
      user: null,
    });
  }
});

module.exports = router;

module.exports = router;
// Profile page
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const { userModel } = require("../db");
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      res.clearCookie("userToken");
      return res.redirect("/login");
    }

    res.render("pages/profile", {
      title: "My Profile",
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.render("pages/profile", {
      title: "My Profile",
      error: "Failed to load profile data",
      user: { firstName: "", lastName: "", email: "" },
    });
  }
});

// Update profile
router.post("/profile", isAuthenticated, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    const { userModel } = require("../db");
    const bcrypt = require("bcrypt");

    // Get the current user
    const user = await userModel.findById(req.userId);

    if (!user) {
      res.clearCookie("userToken");
      return res.redirect("/login");
    }

    // Update basic info
    const updateData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
    };

    // Handle password change if requested
    if (currentPassword && newPassword && confirmPassword) {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        return res.render("pages/profile", {
          title: "My Profile",
          error: "New passwords do not match",
          user,
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
        return res.render("pages/profile", {
          title: "My Profile",
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
          user,
        });
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.render("pages/profile", {
          title: "My Profile",
          error: "Current password is incorrect",
          user,
        });
      }

      // Hash the new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update the user
    const updatedUser = await userModel
      .findByIdAndUpdate(req.userId, updateData, { new: true })
      .select("-password");

    res.render("pages/profile", {
      title: "My Profile",
      user: updatedUser,
      successMessage: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    const user = await require("../db")
      .userModel.findById(req.userId)
      .select("-password");

    res.render("pages/profile", {
      title: "My Profile",
      error: "Failed to update profile",
      user: user || { firstName: "", lastName: "", email: "" },
    });
  }
});
// My Courses page
router.get("/my-courses", isAuthenticated, async (req, res) => {
  try {
    const { purchaseModel, courseModel } = require("../db");

    // Get all purchases for the user
    const purchases = await purchaseModel.find({ userId: req.userId });

    if (!purchases || purchases.length === 0) {
      return res.render("pages/my-courses", {
        title: "My Courses",
        courses: [],
      });
    }

    // Get the course IDs from purchases
    const courseIds = purchases.map((purchase) => purchase.courseId);

    // Get the courses
    const courses = await courseModel.find({
      _id: { $in: courseIds },
    });

    res.render("pages/my-courses", {
      title: "My Courses",
      courses,
    });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.render("pages/my-courses", {
      title: "My Courses",
      error: "Failed to load your courses",
      courses: [],
    });
  }
});
// Course content page
router.get("/courses/:courseId/content", isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { purchaseModel, courseModel, courseContentModel } = require("../db");

    // Check if user has purchased this course
    const purchase = await purchaseModel.findOne({
      userId: req.userId,
      courseId,
    });

    if (!purchase) {
      return res.redirect(`/courses/${courseId}`);
    }

    // Get the course details
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).render("pages/error", {
        title: "Not Found",
        message: "Course not found",
        error: { status: 404 },
      });
    }

    // Get the course content
    const content = await courseContentModel.find({ courseId }).sort("order");

    res.render("pages/course-content", {
      title: course.title,
      course,
      content,
    });
  } catch (error) {
    console.error("Error fetching course content:", error);
    res.render("pages/error", {
      title: "Error",
      message: "Failed to load course content",
      error: { status: 500 },
    });
  }
});
// Course details page
router.get("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseModel, purchaseModel } = require("../db");

    // Get the course details
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).render("pages/error", {
        title: "Not Found",
        message: "Course not found",
        error: { status: 404 },
      });
    }

    // Check if user has purchased this course
    let isPurchased = false;
    if (req.signedCookies.userToken) {
      try {
        const jwt = require("jsonwebtoken");
        const { JWT_USER_PASSWORD } = require("../config");
        const decoded = jwt.verify(
          req.signedCookies.userToken,
          JWT_USER_PASSWORD
        );

        if (decoded && decoded.id) {
          const purchase = await purchaseModel.findOne({
            userId: decoded.id,
            courseId,
          });

          isPurchased = !!purchase;
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }

    res.render("pages/course-details", {
      title: course.title,
      course,
      isPurchased,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.render("pages/error", {
      title: "Error",
      message: "Failed to load course details",
      error: { status: 500 },
    });
  }
});
// Purchase course
router.post("/courses/purchase", isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.body;
    const { purchaseModel, courseModel } = require("../db");

    // Check if course exists
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).render("pages/error", {
        title: "Not Found",
        message: "Course not found",
        error: { status: 404 },
      });
    }

    // Check if already purchased
    const existingPurchase = await purchaseModel.findOne({
      userId: req.userId,
      courseId,
    });

    if (existingPurchase) {
      return res.redirect(`/courses/${courseId}/content`);
    }

    // Create purchase record
    await purchaseModel.create({
      userId: req.userId,
      courseId,
      amount: course.price,
      purchaseDate: new Date(),
    });

    // Redirect to course content
    res.redirect(`/courses/${courseId}/content`);
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.render("pages/error", {
      title: "Error",
      message: "Failed to purchase course",
      error: { status: 500 },
    });
  }
});
