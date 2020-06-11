const User = require("../../schemas/users");
const express = require("express");
const userRouter = express.Router();
const passport = require("passport");

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    const newUser = await User.register(req.body, req.body.password);
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.post("/signin", passport.authenticate("local"), async (req, res) => {
  try {
    // const user = await User.findById(req.user._id);
    res.json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.send({ status: `Remove Successful`, user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = userRouter;
