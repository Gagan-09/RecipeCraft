
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const userID = window.localStorage.getItem("userID");

export default function Navbar() {
  const [cookies, setCookies] = useCookies(["session_token"]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    setCookies("session_token", "", { path: "/" });
    window.localStorage.removeItem("userID");
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo_f.jpg" alt="logo" />
      </div>
      <h2 className="nav-title">RecipeCraft</h2>
      <button
        className="menu-button"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        ☰
      </button>
      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        {userID ? (
          <Link to="/create-recipe" onClick={() => setIsMenuOpen(false)}>
            Create Recipe
          </Link>
        ) : (
          <span style={{ color: "gray" }} id="create-span">Create Recipe</span>
        )}
        {userID ? (
          <Link to="/saved-recipes" onClick={() => setIsMenuOpen(false)}>
            Saved Recipes
          </Link>
        ) : (
          <span style={{ color: "gray" }}>Saved Recipes</span>
        )}
        {!cookies.session_token ? (
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            Login/Register
          </Link>
        ) : (
          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="logout-btn"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
