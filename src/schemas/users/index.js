const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const Joi = require("@hapi/joi");

const cardiacPlan = new mongoose.Schema({
  rehabDuration: Number,
  recommendedExerciseFrequency: Number,
  exerciseDurationGoal: Number,
  dailyFrequencyGoal: Number,
  weeklyFrequencyGoal: Number,
  currentExercise: Number,
  currentDailyFrequency: Number,
  currentWeeklyFrequency: Number,
  thrMin: Number,
  thrMax: Number,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    maxlength: 30,
  },
  lastName: {
    type: String,
    maxlength: 30,
  },
  dateOfBirth: Date,
  sex: {
    type: String,
    enum: ["male", "female"],
  },
  height: {
    type: Number,
    max: 300,
    min: 0,
  },
  weight: {
    type: Number,
    max: 300,
    min: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cardiacRehabPlan: [cardiacPlan],
});

function validateUserSignUp(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return schema.validate(user);
}

function validateUserInfo(user) {
  const sexEnum = ["male", "female"];
  const schema = Joi.object({
    email: Joi.string().email(),
    firstName: Joi.string().max(30),
    lastName: Joi.string().max(30),
    dateOfBirth: Joi.date(),
    sex: Joi.string().valid(...sexEnum),
    height: Joi.number().min(0).max(300),
    weight: Joi.number().min(0).max(300),
    rehabDuration: Joi.number(),
    cardiacRehabPlan: Joi.array(),
  });

  return schema.validate(user, { allowUnknown: true, abortEarly: false });
}

userSchema.plugin(plm);

const User = mongoose.model("user", userSchema);

module.exports = { User, validateUserInfo, validateUserSignUp };
