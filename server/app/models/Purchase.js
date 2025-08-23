const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "course", required: true },
    purchaseDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Add index for faster queries
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = purchaseModel;
