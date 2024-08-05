
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const quotes = [
  '"Cooking is like love. It should be entered into with abandon or not at all." – Harriet van Horne',
  '"The secret ingredient is always love." – Unknown',
  '"Good food is the foundation of genuine happiness." – Auguste Escoffier',
  '"Cooking is at once child\'s play and adult joy. And cooking done with care is an act of love." – Craig Claiborne',
  '"To eat is a necessity, but to eat intelligently is an art." – François de La Rochefoucauld',
  '"Cooking is an art, but all art requires knowing something about the techniques and materials." – Nathan Myhrvold',
  '"One cannot think well, love well, sleep well, if one has not dined well." – Virginia Woolf',
  '"People who love to eat are always the best people." – Julia Child',
  "\"Food brings people together on many different levels. It's nourishment of the soul and body; it's truly love.\" – Giada De Laurentiis",
  '"The best memories are made around the table." – Unknown',
  '"Happiness is homemade." - Unknown',
  '"Life is a kitchen. Put on your prettiest apron and whip up something incredible." - Unknown',
  '"The fondest memories are made when gathered around the table."',
  '"Good food is all the sweeter when shared with good friends."',
  '"The best recipes are those that bring family together."',
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [quote, setQuote] = useState("");
  const [_, setCookie] = useCookies(["session_token"]); // Use `useCookies`
  const navigate = useNavigate();

  useEffect(() => {
    // Select a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://recipe-craft.vercel.app/auth/login", {
        username,
        password,
      });

      setCookie("session_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);

      alert("Login successful!");
      setUsername("");
      setPassword("");
      // Redirect or perform any other actions upon successful login
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    //<div className="login-container">
      <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url(/login.jpg)", 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", 
        margin: "0",
      }}
    >
      <div className="login-content">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="login-form-div">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="login-form-div">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <h3 style={{ textAlign: "center" }}>OR</h3>
          <div className="register-but">
            <Link to="/register">Register</Link>
          </div>
        </form>
        <div className="quote-image-container">
          <div className="quote">
            <p>{quote}</p>
          </div>
       
        </div>
      </div>
    </div>
  );
}
