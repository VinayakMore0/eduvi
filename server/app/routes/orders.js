const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validation");
const { apiLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting and authentication to all order routes
router.use(apiLimiter);
router.use(authenticate);

// Order Creation and Management
router.post("/", validateOrder, orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrderDetails);
router.put("/:orderId/cancel", orderController.cancelOrder);

// Payment Processing
router.post("/:orderId/payment", orderController.processPayment);
router.post("/:orderId/payment/verify", orderController.verifyPayment);

// Refund Management
router.post("/:orderId/refund", orderController.requestRefund);

// Creator Order Management (requires creator role)
router.use(authorize(["creator"]));

router.get("/creator/all", orderController.getAllOrders);
router.get("/creator/analytics", orderController.getOrderAnalytics);
router.put("/creator/:orderId/status", orderController.updateOrderStatus);
router.post("/creator/:orderId/refund/approve", orderController.approveRefund);
router.post("/creator/:orderId/refund/reject", orderController.rejectRefund);

module.exports = router;
