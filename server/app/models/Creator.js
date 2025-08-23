const mongoose = require("mongoose");
const { Schema } = mongoose;

const creatorSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const creatorModel = mongoose.model("creator", creatorSchema);

module.exports = creatorModel;
