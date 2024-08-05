import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function CreateRecipe() {
  const userID = window.localStorage.getItem("userID");
  const [cookies, _] = useCookies(["session_token"]);
  if (!userID) {
    console.error("No user ID found in localStorage. Please log in.");
  }

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    videoUrl: "",
    cookingTime: 0,
    recipeOwner: userID,
  });

  const navigate = useNavigate();
  const [isVideoUrlValid, setIsVideoUrlValid] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });

    // Validate video URL on change
    if (name === "videoUrl") {
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
      setIsVideoUrlValid(youtubeRegex.test(value));
    }
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userID) {
      alert("Please login");
      return;
    }

    if (!isVideoUrlValid) {
      alert("Please enter a valid YouTube video URL.");
      return;
    }

    try {
      // Extract and store only the video ID
      const videoId = getYoutubeVideoId(recipe.videoUrl);
      const recipeWithVideoId = { ...recipe, videoUrl: videoId };

      const response = await axios.post(
        "https://localhost:3001/recipes/create",
        recipeWithVideoId,
        { headers: { authorization: cookies.session_token } }
      );

      alert("Recipe added successfully!");
      console.log("Response data:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Error creating recipe:", err.response || err.message);
      alert(
        "There was an error adding the recipe. Please check the console for more details."
      );
    }
  };

  // Helper function to extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match && match[1]; // Return video ID if found, otherwise undefined
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, idx) => (
            <input
              key={idx}
              type="text"
              name="ingredient"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, idx)}
              required
            />
          ))}
          <button
            className="add-ingredient"
            type="button"
            onClick={addIngredient}
          >
            Add Ingredient
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoUrl">Video URL</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={recipe.videoUrl}
            onChange={handleChange}
            placeholder="Enter YouTube video URL"
          />
          {isVideoUrlValid ? null : (
            <span className="error-message">
              Please enter a valid YouTube video URL.
            </span>
          )}
        </div>
        <div className="video-container">
          {recipe.videoUrl && isVideoUrlValid && (
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                recipe.videoUrl
              )}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <button className="submit-btn" type="submit">
          Create Recipe
        </button>
      </form>
    </div>
  );
}
