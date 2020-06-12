const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    maxlength: 30
  },
  lastName: {
    type: String,
    maxlength: 30
  },
  dateOfBirth: Date,
  sex: {
    type: String,
    enum: ["male", "female"]
  },
  height: {
    type: Number,
    max: 300
  },
  weight: {
    type: Number,
    max: 300
  },
  isAdmin:{
      type: Boolean,
      default:false
  }
});

userSchema.plugin(plm);

const User = mongoose.model("user", userSchema);

module.exports = User;
