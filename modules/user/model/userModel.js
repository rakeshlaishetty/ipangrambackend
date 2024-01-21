const mongoose = require("mongoose");
const validateEmail = require("../../../util/ValidateEmail");
const validatePassword = require("../../../util/ValidatePassword");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "firstName is Required"],
  },
  lastName: {
    type: String,
    required: [true, "LastName is Required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "password is Required"],
    validate: {
      validator: validatePassword,
      message: "Password Must ne 8 charcters",
    },
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "roles",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  departments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Dept",
    },
  ],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
