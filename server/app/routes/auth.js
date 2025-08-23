const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup, validateSignin } = require("../middleware/validation");
const { authLimiter } = require("../middleware/rateLimiter");

// Apply rate limiting to all auth routes
router.use(authLimiter);

// User Authentication Routes
router.post("/signup", validateSignup, authController.signup);
router.post("/signin", validateSignin, authController.signin);
router.post("/signout", authController.signout);

// Password Management
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authController.changePassword);

// Token Management
router.post("/refresh-token", authController.refreshToken);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

// Social Authentication (future implementation)
router.post("/google", authController.googleAuth);
router.post("/facebook", authController.facebookAuth);

module.exports = router;
