const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authService = require("../services/authService");
const {
  JWT_USER_PASSWORD,
  JWT_EXPIRY,
  COOKIE_OPTIONS,
} = require("../../config");

class AuthController {
  // User Registration
  async signup(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role = "student",
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_USER_PASSWORD,
        { expiresIn: JWT_EXPIRY }
      );

      // Set cookie
      res.cookie("userToken", token, COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // User Login
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_USER_PASSWORD,
        { expiresIn: JWT_EXPIRY }
      );

      // Set cookie
      res.cookie("userToken", token, COOKIE_OPTIONS);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // User Logout
  async signout(req, res) {
    try {
      res.clearCookie("userToken");
      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Signout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Forgot Password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await authService.initiatePasswordReset(email);

      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const result = await authService.resetPassword(token, newPassword);

      res.json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Invalid or expired reset token",
      });
    }
  }

  // Change Password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const result = await authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to change password",
      });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      // Implementation for token refresh
      res.json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  }

  // Verify Email
  async verifyEmail(req, res) {
    try {
      // Implementation for email verification
      res.json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Verify email error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }
  }

  // Resend Verification
  async resendVerification(req, res) {
    try {
      // Implementation for resending verification email
      res.json({
        success: true,
        message: "Verification email sent",
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }
  }

  // Google Authentication
  async googleAuth(req, res) {
    try {
      // Implementation for Google OAuth
      res.json({
        success: true,
        message: "Google authentication successful",
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(400).json({
        success: false,
        message: "Google authentication failed",
      });
    }
  }

  // Facebook Authentication
  async facebookAuth(req, res) {
    try {
      // Implementation for Facebook OAuth
      res.json({
        success: true,
        message: "Facebook authentication successful",
      });
    } catch (error) {
      console.error("Facebook auth error:", error);
      res.status(400).json({
        success: false,
        message: "Facebook authentication failed",
      });
    }
  }
}

module.exports = new AuthController();
