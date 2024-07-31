const Recipe = require("../models/recipes");
const User = require("../models/users");
const express = require("express");
const recipesRouter = express.Router();
const verifyToken=require('./userRouter')

// Get all recipes
recipesRouter.get("/get", async (req, res) => {
  try {
    const response = await Recipe.find({}); // Use .find({}) to get all recipes
    res.status(200).json(response); // Use 200 for successful retrieval
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a new recipe
recipesRouter.post("/create",verifyToken, async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe); // Use 201 for successful creation
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Save a recipe for a user
recipesRouter.put("/save",verifyToken, async (req, res) => {
  try {
    const { recipeID, userID } = req.body;
    const recipe = await Recipe.findById(recipeID);
    const user = await User.findById(userID);

    if (!user || !recipe) {
      return res.status(404).json({ message: "User or recipe not found" });
    }

    user.savedRecipes.push(recipe._id);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get saved recipe IDs of a user
recipesRouter.get("/savedRecipes/ids/:userID",verifyToken, async (req, res) => {
  try {
    // const { userID } = req.body;
    // const user = await User.findById(userID);
    const user = await User.findById(req.params.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error("Error getting saved recipe IDs:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get saved recipes of a user
recipesRouter.get("/savedRecipes/:userID", verifyToken,async (req, res) => {
  try {

    const user = await User.findById(req.params.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedRecipes = await Recipe.find({
      _id: { $in: user.savedRecipes },
    });

    res.status(200).json({ savedRecipes });
  } catch (error) {
    console.error("Error getting saved recipes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Export router
module.exports = recipesRouter;
