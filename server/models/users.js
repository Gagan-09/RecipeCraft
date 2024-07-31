const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  ],
});

const User = mongoose.model("User", userSchema);
//------------custom collection name
// const User = mongoose.model("User", userSchema, "my_custom_collection_name");

module.exports = User;
