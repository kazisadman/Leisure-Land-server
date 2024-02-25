const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  { timestamps: true,collection:'users' }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
