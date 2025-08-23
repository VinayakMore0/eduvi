const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        title: String, // Course title at time of purchase
        price: {
          type: Number,
          required: true,
        },
        discountPrice: Number,
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      discount: {
        amount: { type: Number, default: 0 },
        code: String, // coupon code if used
        type: { type: String, enum: ["percentage", "fixed"] },
      },
      tax: {
        amount: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
      },
      total: {
        type: Number,
        required: true,
      },
    },
    payment: {
      method: {
        type: String,
        enum: [
          "credit_card",
          "debit_card",
          "paypal",
          "stripe",
          "razorpay",
          "bank_transfer",
        ],
        required: true,
      },
      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "completed",
          "failed",
          "cancelled",
          "refunded",
        ],
        default: "pending",
      },
      transactionId: String,
      paymentGateway: String,
      paidAt: Date,
      failureReason: String,
    },
    billing: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "confirmed",
        "processing",
        "completed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    fulfillment: {
      isProcessed: {
        type: Boolean,
        default: false,
      },
      processedAt: Date,
      enrollmentsCreated: [
        {
          courseId: { type: Schema.Types.ObjectId, ref: "Course" },
          enrollmentId: { type: Schema.Types.ObjectId, ref: "Enrollment" },
        },
      ],
    },
    refund: {
      isRefunded: {
        type: Boolean,
        default: false,
      },
      refundedAt: Date,
      refundAmount: Number,
      refundReason: String,
      refundTransactionId: String,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      source: String, // web, mobile, api
      campaign: String, // marketing campaign tracking
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Virtual for order total items count
orderSchema.virtual("itemCount").get(function () {
  return this.items.length;
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function () {
  this.pricing.subtotal = this.items.reduce(
    (sum, item) => sum + item.finalPrice,
    0
  );
  this.pricing.total =
    this.pricing.subtotal -
    this.pricing.discount.amount +
    this.pricing.tax.amount;
  return this.pricing.total;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
