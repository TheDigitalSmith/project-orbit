const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const listEndpoints = require("express-list-endpoints");
const app = express();
const passport = require("passport");

const auth = require("./src/utils/auth");
const userRouter = require("./src/routes/users");
const diseaseRouter = require("./src/routes/diseases");

dotenv.config();

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  (err) => console.log(err ? err : "MongoDB connected")
);

app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/diseases", diseaseRouter);

app.get("/", (req, res) => {
  console.log("Server running");
  res.send("Server up and running");
});

const port = process.env.PORT || 9000;
app.listen(3001, () => {
  console.log(`App is launched on launchpad http://localhost:${port}`);
});
console.log(listEndpoints(app));
