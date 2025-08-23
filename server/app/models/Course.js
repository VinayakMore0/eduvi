const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    shortDescription: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (v) {
          return !v || v < this.price;
        },
        message: "Discount price must be less than regular price",
      },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "programming",
        "design",
        "business",
        "marketing",
        "music",
        "photography",
        "other",
      ],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    language: {
      type: String,
      default: "en",
    },
    duration: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    requirements: [String],
    whatYouWillLearn: [String],
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    metadata: {
      totalLessons: { type: Number, default: 0 },
      totalQuizzes: { type: Number, default: 0 },
      totalAssignments: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
courseSchema.index({ instructorId: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ "rating.average": -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });

// Virtual for effective price (considering discount)
courseSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice || this.price;
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
