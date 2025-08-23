const multer = require("multer");
const storage = multer.diskStorage({
  destination: "uploads/", // local uploads folder
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
module.exports = multer({ storage });
