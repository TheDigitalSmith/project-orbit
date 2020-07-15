const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const listEndpoints = require("express-list-endpoints");
const app = express();
const passport = require("passport");
require("express-async-errors");

const auth = require("./src/utils/auth");
const logger = require("./src/utils/logger");
const userRouter = require("./src/routes/users");
const diseaseRouter = require("./src/routes/diseases");
const errorMiddleware = require("./src/utils/error");
const diaryRouter = require("./src/routes/diaries")

dotenv.config();

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => console.log(err ? err : "MongoDB connected")
);

app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/diseases", diseaseRouter);
app.use("/api/diaries", diaryRouter)
app.use(errorMiddleware);

app.get("/", (req, res) => {
  console.log("Server running");
  res.send("Server up and running");
});

const port = process.env.PORT || 9000;
app.listen(3001, () => {
  logger.info(`App is launched on launchpad http://localhost:${port}`);
});
console.log(listEndpoints(app));
