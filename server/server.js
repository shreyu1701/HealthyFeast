// server.js

const express = require("express");
const cors = require("cors");
const recipes = require("../api/recipes.json");
const news = require("../api/news.json");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Endpoint to get all recipes
app.get("/api/recipes.json", (req, res) => {
  res.json(recipes);
});

// Endpoint to get a recipe by ID
app.get("/api/recipes.json/:id", (req, res) => {
  const recipeId = parseInt(req.params.id, 10);
  const recipe = recipes.find((r) => r.id === recipeId);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).js({ message: "Recipe not found" });
  }
});

app.get("/api/news.json", (req, res) => {
  res.sendFile(path.join(__dirname, "api", "news.json"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1/:${PORT}`);
});
