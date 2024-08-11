const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter.js");
const recipesRouter = require("./routes/recipesRouter.js");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
// app.use(
//   cors({
//     origin: ["https://recipecraft.netlify.app"],
//     methods: ["POST", "GET", "PUT"],
//     credentials: true,
//   })
// );

// API routes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

// Port
const port = 3001 || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
