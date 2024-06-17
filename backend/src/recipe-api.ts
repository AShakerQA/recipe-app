import "dotenv/config";
const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

  const queryParams = {
    apiKey: apiKey,
    query: searchTerm,
    number: "10",
    offset: (page * 10).toString(),
  };
  url.search = new URLSearchParams(queryParams).toString(); //attach query params to end of url

  try {
    const searchResponse = await fetch(url);
    const resultsJson = await searchResponse.json();
    return resultsJson;
  } catch (error) {
    console.log(error);
  }
};

export const getRecipeSummary = async (recipeId: string) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const baseUrl = new URL(
    `https://api.spoonacular.com/recipes/${recipeId}/summary`
  );
  const queryParams = {
    apiKey: apiKey,
  };
  baseUrl.search = new URLSearchParams(queryParams).toString();

  const response = await fetch(baseUrl);
  const json = await response.json();

  return json;
};

export const getFavouriteRecipesByIDs = async (ids: string[]) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const baseUrl = new URL(
    "https://api.spoonacular.com/recipes/informationBulk"
  );
  const queryParams = {
    apiKey: apiKey,
    ids: ids.join(","), //structure API endpoint requires
  };
  baseUrl.search = new URLSearchParams(queryParams).toString();

  const response = await fetch(baseUrl);
  const json = await response.json();

  return { results: json };
};
