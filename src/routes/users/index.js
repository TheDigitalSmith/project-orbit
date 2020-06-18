const express = require("express");
const userRouter = express.Router();
const passport = require("passport");

const { getToken } = require("../../utils/auth");
const {
  User,
  validateUserInfo,
  validateUserSignUp,
} = require("../../schemas/users");
const validator = require("../../utils/validation");

userRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

userRouter.post("/signup", validator(validateUserSignUp), async (req, res) => {
  const newUser = await User.register(req.body, req.body.password);
  const user = await User.findById(newUser._id);
  const token = getToken(newUser);
  res.status(200).json({ user, access_token: token });
});

userRouter.post("/signin", passport.authenticate("local"), async (req, res) => {
  const user = await User.findById(req.user._id);
  const token = getToken(req.user);
  res.json({ user, access_token: token });
});

userRouter.post("/refresh", passport.authenticate("jwt"), async (req, res) => {
  const token = getToken(req.user);
  res.json({ access_token: token });
});

userRouter.put(
  "/:id",
  [passport.authenticate("jwt"), validator(validateUserInfo)],
  async (req, res) => {
    delete req.body._id;
    const authorisedUserId = req.user._id.toString();
    if (req.params.id !== authorisedUserId)
      return res.status(401).json("Unauthorised");
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { ...req.body } },
      { new: true, runValidators: true }
    );
    res.json(user);
  }
);

userRouter.delete("/:id", passport.authenticate("jwt"), async (req, res) => {
  const authorisedUserId = req.user._id.toString();
  if (req.params.id !== authorisedUserId)
    return res.status(401).json("Unauthorised");
  const user = await User.findByIdAndRemove(req.user._id);
  res.send({ status: `Remove Successful`, user });
});

module.exports = userRouter;
