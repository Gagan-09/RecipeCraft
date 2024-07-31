const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter.js");
const recipesRouter = require("./routes/recipesRouter.js");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Middleware
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

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
