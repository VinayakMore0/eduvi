const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactMessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const contactMessageModel = mongoose.model(
  "ContactMessage",
  ContactMessageSchema
);
module.exports = contactMessageModel;
