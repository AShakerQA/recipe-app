import express from "express";
import cors from "cors";
import "dotenv/config";
import * as RecipeAPI from "./recipe-api";
import { PrismaClient } from "@Prisma/client";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/recipes/search", async (req, res) => {
  //GET http://localhost/api/recipes/search?searchTerm=pasta@page=1
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string); // can be string, string Arr or undefined, therefore needs to be string
  const results = await RecipeAPI.searchRecipes(searchTerm, page);

  return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  //: means path param
  const recipeId = req.params.recipeId;
  const results = await RecipeAPI.getRecipeSummary(recipeId);
  return res.json(results);
});

app.post("/api/recipes/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: {
        recipeId: recipeId,
      },
    });
    return res.status(201).json(favouriteRecipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "creation error" });
  }
});

app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
