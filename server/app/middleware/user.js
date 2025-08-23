const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../../config");

function userMiddleware(req, res, next) {
  try {
    // First try to get token from cookies
    const token = req.signedCookies.userToken || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please log in.",
      });
    }

    // Handle Bearer token format if it's from headers
    const tokenString =
      token.startsWith && token.startsWith("Bearer ") ? token.slice(7) : token;

    const decoded = jwt.verify(tokenString, JWT_USER_PASSWORD);

    if (decoded) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(403).json({
        message: "Invalid authentication token",
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Clear the expired cookie
      res.clearCookie("userToken");

      return res.status(401).json({
        message: "Session expired, please login again",
      });
    }

    res.status(403).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
}

module.exports = {
  userMiddleware,
};
