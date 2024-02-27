const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const port = 5000;

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("./models/users.js");

//middlewire
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//database connection
mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: "leisure_land",
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.error(err));

//password hasing
const saltRounds = 10;

//jwt private key
const jwtPrivateKey = process.env.PRIVATE_KEY;

//Register user
app.post("/register", (req, res) => {
  const token = req.cookies?.token;
  const { userName, email, password } = req.body;

  if (!token) {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) throw err;
      const hashedPassword = hash;
      const registerData = await User.create({
        userName: userName,
        email: email,
        password: hashedPassword,
      });
    });

    jwt.sign({ email, password }, jwtPrivateKey, {}, (err, token) => {
      if (err) throw err;
      console.log(token);
      res
        .cookie("token", token, { sameSite: "none", secure: true })
        .send("cookie set successfully");
    });
  } else {
    res.status(400).send("cookie already exist");
  }
});

//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const token = req.cookies?.token;

  if (!token) {
    const matchedUser = await User.findOne({ email });

    const hashedPassword = matchedUser.password;

    if (matchedUser) {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (result) {
          jwt.sign({ email, password }, jwtPrivateKey, {}, (err, token) => {
            if (err) throw err;
            res.cookie("token", token).send("cookie set successfully");
          });
        } else {
          res.send(err);
        }
      });
    }
  } else {
    res.status(400).send("cookie already exist");
  }
});

//User data
app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  console.log(token);
  if (token) {
    jwt.verify(token, jwtPrivateKey, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  }
});

app.get("/", (req, res) => {
  res.send("Sever is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
