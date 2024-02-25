const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = 5000;

const User = require("./models/users.js");

//middlewire

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

//database connection
mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "leisure_land",
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.error(err));

//Register user
app.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  const registerData = await User.create({
    userName: userName,
    email: email,
    password: password,
  });
});

app.get("/", (req, res) => {
  res.send("Sever is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
