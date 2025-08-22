// sets up Express, middleware, and mounts your routes.


const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./middleware/passport")(passport);

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Example route mounts
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/courses", require("./routes/courses"));

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

module.exports = app;

