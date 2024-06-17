import express from "express";
import cors from "cors";
import "dotenv/config";
import * as RecipeAPI from "./recipe-api";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/recipes/search", async (req, res) => {
  //GET http://localhost/api/recipes/search?searchTerm=pasta@page=1
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string); // can be string, string Arr or undefined, therefore needs to be string
  const results = await RecipeAPI.searchRecipes(searchTerm, page);

  return res.json(results);
});

app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
