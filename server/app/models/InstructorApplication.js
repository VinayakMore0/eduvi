const mongoose = require("mongoose");
const { Schema } = mongoose;

const instructorApplicationSchema = new Schema({
  bio: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  skills: { type: [String], required: true }, // array of skills
  motivation: { type: String, required: true },
  sampleWork: { type: String }, // optional field
  createdAt: { type: Date, default: Date.now },
});

const InstructorApplication = mongoose.model(
  "InstructorApplication",
  instructorApplicationSchema
);

module.exports = InstructorApplication;
