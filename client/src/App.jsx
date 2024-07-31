import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CreateRecipe from "./pages/createRecipe";
import SavedRecipes from "./pages/savedRecipes";
import Navbar  from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/create-recipe" element={<CreateRecipe />}></Route>
          <Route path="/saved-recipes" element={<SavedRecipes />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
