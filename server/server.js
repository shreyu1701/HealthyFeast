// server.js

const express = require("express");
const cors = require("cors");
const recipes = require("./api/recipes.json");

const app = express();
const PORT = 5500;

app.use(cors());

// Endpoint to get all recipes
app.get("../api/recipes.json", (req, res) => {
  res.json(recipes);
});

// Endpoint to get a recipe by ID
app.get("../api/recipes.json/:id", (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  const recipe = recipes.find((r) => r.id === recipeId);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).js({ message: "Recipe not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on https://healthy-feast.vercel.app/`);
});
