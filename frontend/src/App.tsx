import { useState, FormEvent, useRef } from "react";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import RecipeModal from "./components/RecipeModal";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const pageNumber = useRef(1); //don't want page to rerender when page changes

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);

      setRecipes(recipes.results);
      pageNumber.current = 1;
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);

      setRecipes([...recipes, ...nextRecipes.results]); //append new page to existing fetched recipes
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={(event) => handleSearchSubmit(event)}>
        <input
          type="text"
          placeholder="Enter a search term..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)} //update state with user input
          required
        ></input>
        <button type="submit">Submit</button>
      </form>

      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
      ))}
      <button className="view-more-button" onClick={handleViewMoreClick}>
        View More
      </button>
      {selectedRecipe ? (
        <RecipeModal recipeId={selectedRecipe.id.toString()} />
      ) : null}
    </div>
  );
};

export default App;
