const { Router } = require("express");
const bcrypt = require("bcrypt");
const z = require("zod");
const { userModel, purchaseModel, courseModel } = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

// User signup validation schema
const userSchema = z.object({
  email: z.string().min(3).max(100).email(),
  password: z
    .string()
    .min(8)
    .max(100)
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must include an uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Must include a lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), { message: "Must include a number" })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Must include a special character",
    }),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

userRouter.post("/signup", async function (req, res) {
  try {
    console.log("API signup received:", req.body);

    const parsedData = userSchema.safeParse(req.body);
    if (!parsedData.success) {
      console.log("Validation failed:", parsedData.error.format());
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error.format(),
      });
    }

    const { email, password, firstName, lastName } = parsedData.data;
    console.log("Validated data:", { email, firstName, lastName });

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    console.log("User created successfully:", newUser._id);

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Error while signing up",
      error: error.message,
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user._id.toString(),
        },
        JWT_USER_PASSWORD,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({
      message: "Error during signin",
    });
  }
});

userRouter.get("/profile", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;

    const purchases = await purchaseModel.find({ userId });

    if (purchases.length === 0) {
      return res.json({
        message: "You haven't purchased any courses yet",
        purchases: [],
        courses: [],
      });
    }

    const courseIds = purchases.map((purchase) => purchase.courseId);

    const courses = await courseModel.find({
      _id: { $in: courseIds },
    });

    res.json({
      purchases,
      courses,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Update user profile
userRouter.put("/profile", userMiddleware, async function (req, res) {
  try {
    const userId = req.userId;

    const updateSchema = z.object({
      firstName: z.string().min(2).max(100).optional(),
      lastName: z.string().min(2).max(100).optional(),
      currentPassword: z.string().optional(),
      newPassword: z
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
        })
        .optional(),
    });

    const parsedData = updateSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedData.error.format(),
      });
    }

    const { firstName, lastName, currentPassword, newPassword } =
      parsedData.data;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    // If user wants to change password
    if (currentPassword && newPassword) {
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({
          message: "Current password is incorrect",
        });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = {
  userRouter,
};
