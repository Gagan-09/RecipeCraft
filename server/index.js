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
    origin: ["https://recipecraft.netlify.app/"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// // Catchall handler to serve the React app for any non-API route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

// Database connection
mongoose
  .connect(
    process.env.MONGO_URI
    //   {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // })
  )
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

// Port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
