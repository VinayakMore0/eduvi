const mongoose = require("mongoose");
const { Schema } = mongoose;

const socialSchema = new Schema({
  linkedin: { type: String },
  twitter: { type: String },
  github: { type: String },
});

const instructorSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    students: { type: Number, default: 0 },
    courses: { type: Number, default: 0 },
    experience: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    social: socialSchema,
    totalEarnings: { type: String },
    joinDate: { type: Date },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
