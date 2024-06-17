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
  //   console.log("abdul");
  //   console.log(queryParams);
  url.search = new URLSearchParams(queryParams).toString(); //attach query params to end of url

  try {
    const searchResponse = await fetch(url);
    // console.log(searchResponse);
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

  try {
    const response = await fetch(baseUrl);
    const resultJson = await response.json();
    return resultJson;
  } catch (error) {
    console.log(error);
  }
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

  try {
    const response = await fetch(baseUrl);
    const resultJson = await response.json();
    return { result: resultJson };
  } catch (error) {
    console.log(error);
  }
};
