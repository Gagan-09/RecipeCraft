

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [toggleDetails, setToggleDetails] = useState({});
  const userID = window.localStorage.getItem("userID");
  const [cookies, _] = useCookies(["session_token"]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes/get");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    if (!userID) alert("Please login to save Recipes!");
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes/save",
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.session_token } }
      );
      setSavedRecipes(response.data.savedRecipes);
      console.log(response);
      alert("Saved Successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const handleToggleDetails = (recipeID) => {
    setToggleDetails((prevState) => ({
      ...prevState,
      [recipeID]: !prevState[recipeID],
    }));
  };

  return (
    <div className="home-body">
      <h1>RECIPES</h1>
      <ul className="lists">
        {recipes.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <button
              className="save-btn"
              onClick={() => saveRecipe(recipe._id)}
              disabled={isRecipeSaved(recipe._id)}
            >
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
            </button>
            <div
              className={`recipe-details ${
                toggleDetails[recipe._id] ? "expanded" : ""
              }`}
            >
              <div
                className="recipe-header"
                onClick={() => handleToggleDetails(recipe._id)}
              >
                <h2>
                  <u>{recipe.name}</u>
                </h2>
              </div>
              <div className="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="instructions">
                <h3>Cooking Instructions:</h3>
                <p>{recipe.instructions}</p>
              </div>
              <div className="video-container">
                {recipe.videoUrl && (
                  <iframe
                    src={`https://www.youtube.com/embed/${recipe.videoUrl}`}
                    className="video-box"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div className="cooking-time">
                <h3>Cooking Time: {recipe.cookingTime} minutes</h3>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

