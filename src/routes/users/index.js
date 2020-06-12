const User = require("../../schemas/users");
const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const { getToken } = require("../../utils/auth");

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
    const newUser = await User.register(req.body, req.body.password)
    const user = await User.findById(newUser._id)
    const token = getToken(newUser);
    res.status(200).json({ user, access_token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.post("/signin", passport.authenticate("local"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const token = getToken(req.user);
    res.json({ user, access_token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.post("/refresh", passport.authenticate("jwt"), async (req, res) => {
  try {
    const token = getToken(req.user);
    res.json({ access_token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.put("/:id", passport.authenticate("jwt"), async (req, res) => {
  try {
    delete req.body._id;
    const authorisedUserId = req.user._id.toString();
    if (req.params.id !== authorisedUserId)
      return res.status(401).json("Unauthorised");
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { ...req.body } },
      { new: true , runValidators:true}
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

userRouter.delete("/:id", passport.authenticate("jwt"), async (req, res) => {
  try {
    const authorisedUserId = req.user._id.toString();
    if (req.params.id !== authorisedUserId)
      return res.status(401).json("Unauthorised");
    const user = await User.findByIdAndRemove(req.user._id);
    res.send({ status: `Remove Successful`, user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = userRouter;
