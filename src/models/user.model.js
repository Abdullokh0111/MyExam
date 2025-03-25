const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures the username field is unique in the database
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  refreshToken: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
