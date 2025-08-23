module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD || "user_secret_key",
  JWT_CREATOR_PASSWORD:
    process.env.JWT_CREATOR_PASSWORD || "creator_secret_key",
  JWT_EXPIRY: "7d",
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    sameSite: "strict",
  },
};
