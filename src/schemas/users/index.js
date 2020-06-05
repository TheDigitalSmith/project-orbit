const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   email: String,
   firstName: String,
   lastName: String,
   dateOfBirth: Date,
   sex: String,
   height: Number,
   weight: Number
})

const User = mongoose.model('user', userSchema);

module.exports = User;