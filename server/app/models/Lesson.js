const mongoose = require("mongoose");
const { Schema } = mongoose;

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
    type: {
      type: String,
      enum: ["video", "article", "quiz", "assignment", "live"],
      default: "video",
    },
    content: {
      videoUrl: String,
      videoDuration: Number, // in seconds
      videoThumbnail: String,
      articleContent: String, // HTML content for articles
      attachments: [
        {
          name: String,
          url: String,
          type: String, // pdf, doc, etc.
          size: Number,
        },
      ],
    },
    order: {
      type: Number,
      required: true,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    settings: {
      allowComments: { type: Boolean, default: true },
      allowDownload: { type: Boolean, default: false },
      autoPlay: { type: Boolean, default: false },
    },
    metadata: {
      views: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      averageWatchTime: { type: Number, default: 0 }, // in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ courseId: 1, status: 1 });
lessonSchema.index({ type: 1 });
lessonSchema.index({ isPreview: 1 });

// Ensure unique order within a course
lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
