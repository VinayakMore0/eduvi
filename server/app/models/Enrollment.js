const mongoose = require("mongoose");
const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "suspended"],
      default: "active",
    },
    progress: {
      completedLessons: [
        {
          lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
          completedAt: { type: Date, default: Date.now },
          watchTime: Number, // in seconds
          score: Number, // for quizzes/assignments
        },
      ],
      currentLesson: {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
      progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      totalWatchTime: {
        type: Number,
        default: 0, // in seconds
      },
    },
    completion: {
      isCompleted: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
      certificateIssued: {
        type: Boolean,
        default: false,
      },
      certificateUrl: String,
      finalScore: Number,
    },
    access: {
      expiresAt: Date, // for time-limited courses
      isLifetime: {
        type: Boolean,
        default: true,
      },
    },
    notes: [
      {
        lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
        content: String,
        timestamp: Number, // video timestamp in seconds
        createdAt: { type: Date, default: Date.now },
      },
    ],
    bookmarks: [
      {
        lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
        timestamp: Number,
        title: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ "completion.isCompleted": 1 });

// Virtual for completion rate
enrollmentSchema.virtual("completionRate").get(function () {
  return this.progress.progressPercentage;
});

// Method to update progress
enrollmentSchema.methods.updateProgress = function () {
  // This would calculate progress based on completed lessons
  // Implementation would depend on your business logic
};

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
