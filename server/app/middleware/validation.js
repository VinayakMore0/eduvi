const { z } = require("zod");

// User validation schemas
const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  role: z.enum(["student", "instructor"]).optional(),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  profile: z
    .object({
      avatar: z.string().url().optional(),
      bio: z.string().max(500).optional(),
      phone: z.string().max(20).optional(),
      dateOfBirth: z.string().datetime().optional(),
    })
    .optional(),
  preferences: z
    .object({
      notifications: z
        .object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
        })
        .optional(),
      language: z.string().max(5).optional(),
    })
    .optional(),
});

// Course validation schemas
const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  shortDescription: z.string().max(500).optional(),
  price: z.number().min(0, "Price must be non-negative"),
  discountPrice: z.number().min(0).optional(),
  imageUrl: z.string().url("Invalid image URL"),
  thumbnailUrl: z.string().url().optional(),
  category: z.enum([
    "programming",
    "design",
    "business",
    "marketing",
    "music",
    "photography",
    "other",
  ]),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  language: z.string().max(5).optional(),
  duration: z
    .object({
      hours: z.number().min(0).optional(),
      minutes: z.number().min(0).max(59).optional(),
    })
    .optional(),
  requirements: z.array(z.string()).optional(),
  whatYouWillLearn: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Lesson validation schema
const lessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000).optional(),
  type: z.enum(["video", "article", "quiz", "assignment", "live"]).optional(),
  content: z
    .object({
      videoUrl: z.string().url().optional(),
      videoDuration: z.number().min(0).optional(),
      videoThumbnail: z.string().url().optional(),
      articleContent: z.string().optional(),
      attachments: z
        .array(
          z.object({
            name: z.string(),
            url: z.string().url(),
            type: z.string(),
            size: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  order: z.number().min(1, "Order must be positive"),
  isPreview: z.boolean().optional(),
  isFree: z.boolean().optional(),
  settings: z
    .object({
      allowComments: z.boolean().optional(),
      allowDownload: z.boolean().optional(),
      autoPlay: z.boolean().optional(),
    })
    .optional(),
});

// Order validation schema
const orderSchema = z.object({
  items: z
    .array(
      z.object({
        courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
        price: z.number().min(0),
        discountPrice: z.number().min(0).optional(),
      })
    )
    .min(1, "At least one item is required"),
  billing: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      address: z
        .object({
          street: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
          zipCode: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData; // Replace with validated data
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      console.error("Validation error:", error);
      res.status(500).json({
        success: false,
        message: "Internal validation error",
      });
    }
  };
};

// Query parameter validation
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors,
        });
      }

      console.error("Query validation error:", error);
      res.status(500).json({
        success: false,
        message: "Internal validation error",
      });
    }
  };
};

// Pagination query schema
const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// Search query schema
const searchSchema = z
  .object({
    q: z.string().min(1, "Search query is required").max(100),
    category: z.string().optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    minPrice: z
      .string()
      .regex(/^\d+(\.\d{2})?$/)
      .transform(Number)
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+(\.\d{2})?$/)
      .transform(Number)
      .optional(),
  })
  .merge(paginationSchema);

// Exported validation middleware
module.exports = {
  // Auth validations
  validateSignup: validate(signupSchema),
  validateSignin: validate(signinSchema),
  validateUserUpdate: validate(userUpdateSchema),

  // Course validations
  validateCourse: validate(courseSchema),
  validateLesson: validate(lessonSchema),

  // Order validations
  validateOrder: validate(orderSchema),

  // Query validations
  validatePagination: validateQuery(paginationSchema),
  validateSearch: validateQuery(searchSchema),

  // Generic validation
  validate,
  validateQuery,

  // Schemas for custom use
  schemas: {
    signup: signupSchema,
    signin: signinSchema,
    userUpdate: userUpdateSchema,
    course: courseSchema,
    lesson: lessonSchema,
    order: orderSchema,
    pagination: paginationSchema,
    search: searchSchema,
  },
};
