const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const { JWT_USER_PASSWORD } = require("../../config");

class AuthService {
  // Create new user
  async createUser(userData) {
    const { email, password, firstName, lastName, role = "student" } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
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
    return user;
  }

  // Authenticate user
  async authenticateUser(email, password) {
    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_USER_PASSWORD,
      { expiresIn: "7d" }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_USER_PASSWORD);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Initiate password reset
  async initiatePasswordReset(email) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      // Don't reveal if email exists or not
      return { success: true };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user (you'd need to add these fields to User model)
    // user.passwordResetToken = resetToken;
    // user.passwordResetExpiry = resetTokenExpiry;
    // await user.save();

    // TODO: Send email with reset link
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { success: true };
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    // Find user with valid reset token
    // const user = await User.findOne({
    //     passwordResetToken: token,
    //     passwordResetExpiry: { $gt: new Date() },
    //     isActive: true
    // });

    // if (!user) {
    //     throw new Error('Invalid or expired reset token');
    // }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    // user.password = hashedPassword;
    // user.passwordResetToken = undefined;
    // user.passwordResetExpiry = undefined;
    // await user.save();

    // TODO: Implement actual reset logic
    throw new Error("Password reset not implemented yet");
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    return { success: true };
  }

  // Refresh token
  async refreshToken(oldToken) {
    try {
      const decoded = jwt.verify(oldToken, JWT_USER_PASSWORD, {
        ignoreExpiration: true,
      });

      // Check if user still exists and is active
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new Error("User not found or inactive");
      }

      // Generate new token
      return this.generateToken(user);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  // Validate user session
  async validateSession(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.isActive) {
        throw new Error("Invalid session");
      }

      return user;
    } catch (error) {
      throw new Error("Invalid session");
    }
  }

  // Logout (invalidate token - would need token blacklist)
  async logout(token) {
    // TODO: Implement token blacklist
    // For now, client-side token removal is sufficient
    return { success: true };
  }

  // Generate email verification token
  generateEmailVerificationToken(userId) {
    return jwt.sign({ userId, type: "email_verification" }, JWT_USER_PASSWORD, {
      expiresIn: "24h",
    });
  }

  // Verify email verification token
  async verifyEmailToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_USER_PASSWORD);

      if (decoded.type !== "email_verification") {
        throw new Error("Invalid token type");
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Mark email as verified
      // user.emailVerified = true;
      // user.emailVerifiedAt = new Date();
      // await user.save();

      return user;
    } catch (error) {
      throw new Error("Invalid or expired verification token");
    }
  }
}

module.exports = new AuthService();
