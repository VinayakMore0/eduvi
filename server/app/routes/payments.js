// routes/payments.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/dummy-payment", async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    // Create new order
    const order = new Order({
      userId,
      items: items.map((item) => ({
        courseId: item.courseId,
        title: item.title,
        price: item.price,
        discountPrice: item.discountPrice || 0,
        finalPrice: item.finalPrice || item.price,
      })),
      pricing: {
        subtotal: 0, // will be calculated
        discount: { amount: 0 },
        tax: { amount: 0 },
        total: 0,
      },
      payment: {
        method: "razorpay", // dummy method (required)
        status: "completed",
        transactionId: `DUMMY-${Date.now()}`,
        paymentGateway: "dummy",
        paidAt: new Date(),
      },
      billing: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      },
      status: "completed",
    });

    // calculate totals before save
    order.calculateTotals();

    await order.save();

    res.status(201).json({
      success: true,
      message: "Dummy payment successful",
      order,
    });
  } catch (error) {
    console.error("Dummy payment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment processing failed. Please try again.",
      error: error.message, // helpful in dev
    });
  }
});

module.exports = router;
