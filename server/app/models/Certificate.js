const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    // Certificate details
    title: {
      type: String,
      required: true,
    },
    description: String,
    issuer: {
      name: String,
      logo: String,
    },
    // Certificate verification
    verificationCode: {
      type: String,
      unique: true,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    // Certificate file
    certificateUrl: String,
    certificateHash: String, // For blockchain verification if needed
    // Timestamps
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date, // null for lifetime certificates
    // Additional metadata
    grade: String, // e.g., "A+", "Pass", etc.
    completionScore: Number,
    courseDuration: String,
    skills: [String], // Skills learned in the course
  },
  {
    timestamps: true,
  }
);

// Indexes
certificateSchema.index({ user: 1, issuedAt: -1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ verificationCode: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
