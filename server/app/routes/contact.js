const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/Contact");

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });
    await contactMessage.save();
    res.json({
      success: true,
      message: "Contact message received and stored!",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact message." });
  }
});

module.exports = router;
