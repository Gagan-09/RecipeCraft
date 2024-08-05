import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SavedRecipes.module.css"; // Import the CSS module

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = window.localStorage.getItem("userID");

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://recipecraft.onrender.com/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  return (
    <div className={styles["home-body"]}>
      <h1>SAVED RECIPES</h1>
      <ul className={styles.lists}>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id} className={styles["recipe-card"]}>
            <div className={styles["recipe-header"]}>
              <h2>
                <u>{recipe.name}</u>
              </h2>
            </div>
            <div className={styles.ingredients}>
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className={styles.instructions}>
              <h3>Cooking Instructions:</h3>
              <p>{recipe.instructions}</p>
            </div>
            <div className={styles["image-container"]}>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className={styles["recipe-image"]}
              />
            </div>
            <div className={styles["cooking-time"]}>
              <h3>Cooking Time: {recipe.cookingTime} minutes</h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
