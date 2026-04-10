const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

const userRoutes = require("./routes/users");
const groupRoutes = require("./routes/groups");
const authRoutes = require("./routes/auth");
const logRoutes = require("./routes/logs");
const messageRoutes = require("./routes/messages");
const scoreRoutes = require("./routes/scores");
const globalRoutes = require("./routes/global");

app.use(cookieParser('sdi-com'));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/auth", authRoutes);
app.use("/logs", logRoutes);
app.use("/messages", messageRoutes);
app.use("/scores", scoreRoutes);
app.use("/global", globalRoutes);

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "Welcome to the empty route traveler ♡(˶>⩊<˶)" });
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
