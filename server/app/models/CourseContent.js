const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseContentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  contentType: {
    type: String,
    enum: ["video", "article", "quiz"],
    default: "video",
  },
  duration: { type: Number }, // in minutes
  order: { type: Number, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "course", required: true },
});

const courseContentModel = mongoose.model("courseContent", courseContentSchema);

module.exports = courseContentModel;
