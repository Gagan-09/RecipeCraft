const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const userRouter = express.Router();


// Middleware for verifying token
const verifyToken = (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      req.userId = decoded.id;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};
// Define your routes here
userRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //save to database
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    //display success
    res.status(201).json({ message: "User registered successfully!!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
//login
// use this if no logout feature
// userRouter.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const isPassword = await bcrypt.compare(password, user.password);
//     if (!isPassword) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }
//     //create token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     // .sign(payload, secretOrPrivateKey, [options, callback]) -->syntax
//     res.json({ token, userID: user._id });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error });
//   }
// });

//
//login
userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // .sign(payload, secretOrPrivateKey, [options, callback]) -->syntax
    // Set the token as a cookie
    res
      .cookie("token", token, {
        httpOnly: true, // Cookie is only accessible by the server
        sameSite: "strict", // CSRF protection
      })
      .json({ token, userID: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//logout
userRouter.get("/logout", (req, res) => {
  // Check if token exists in cookies
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  // Clear the token cookie
  res
    .status(200)
    .cookie("token", "", {
      //  ""-> means empty cookie i.e clears the cookie
      httpOnly: true,
      expires: new Date(0), // Expire the cookie immediately
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

// Export the router
module.exports = userRouter;

