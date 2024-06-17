import { useState, FormEvent, useRef, useEffect } from "react";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import RecipeModal from "./components/RecipeModal";

type Tabs = "search" | "favourites"; //only two types of tabs

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1); //don't want page to rerender when page changes

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavouriteRecipes();
  }, []);

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

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      );
      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favourites")}>Favourites</h1>
      </div>
      {selectedTab === "search" && (
        <>
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

          {recipes.map((recipe) => {
            const isFavourite = favouriteRecipes.some(
              (favRecipe) => recipe.id === favRecipe.id
            );

            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={
                isFavourite ? addFavouriteRecipe : removeFavouriteRecipe
              }
              isFavourite={true}
            />;
          })}
          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favourites" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={() => removeFavouriteRecipe}
              isFavourite={true}
            />
          ))}
        </div>
      )}
      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};

export default App;
